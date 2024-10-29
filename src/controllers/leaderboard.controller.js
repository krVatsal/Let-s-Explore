// /api/events/[event].js (or appropriate path)
import { NextResponse } from 'next/server';
import { connectDB } from '../db/dbConnect';
import redis from '../db/redis';
import Participant from '../models/user.models';
import HuntModel from '../models/hunt.models';

// GET Function to retrieve leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    // Try to get cached leaderboard
    const cachedLeaderboard = await redis.get('leaderboard');
    if (cachedLeaderboard) {
      return NextResponse.json(JSON.parse(cachedLeaderboard));
    }

    // If no cache, query MongoDB
    await connectDB();

    const leaderboard = await Participant.aggregate([
      {
        $sort: {
          totalPoints: -1,
          totalTime: 1,
        },
      },
      {
        $project: {
          name: 1,
          totalPoints: 1,
          totalTime: 1,
          _id: 0,
        },
      },
    ]);

    // Cache the result
    await redis.set('leaderboard', JSON.stringify(leaderboard), 'EX', 60);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

// POST Function to join an event
export const joinEvent = async (req, res) => {
  try {
    const body = await req.json();
    const { userId, huntId } = body; // Accept userId and huntId to identify the participant and event.

    if (!userId || !huntId) {
      return NextResponse.json(
        { error: 'User ID and Hunt ID are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the hunt by ID and update it by adding the participant
    const hunt = await HuntModel.findByIdAndUpdate(
      huntId,
      {
        $addToSet: { participants: userId }, // Ensure no duplicates
        $push: {
          leaderboard: {
            user: userId,
            score: 0, // Initial score for the leaderboard
            timeCompleted: null // Initialize timeCompleted to null
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!hunt) {
      return NextResponse.json(
        { error: 'Hunt not found' },
        { status: 404 }
      );
    }

    // Optionally, you can also create a Participant entry if needed
    const participant = new Participant({ userId, hunt: huntId });
    await participant.save();

    return NextResponse.json(hunt, { status: 201 });
  } catch (error) {
    console.error('Error joining event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

// Export functions as named constants
export default {
  getLeaderboard,
  joinEvent,
};
