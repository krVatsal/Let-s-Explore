import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import redis from 'ioredis';
import { HuntModel } from "../models/hunt.models.js";
import mongoose from "mongoose";
// export const joinEvent = asyncHandler(async (req, res) => {
//     const { userId, huntId } = req.body;

//     if (!userId || !huntId) {
//         throw new ApiError(400, 'User ID and Hunt ID are required');
//     }

//     const currentTime = new Date();

//     const hunt = await HuntModel.findByIdAndUpdate(
//         huntId,
//         {
//             $addToSet: { participants: { user: userId, guesses: [] } },
//             $push: {
//                 leaderboard: {
//                     user: userId,
//                     score: 0,
//                     timeCompleted: currentTime
//                 }
//             }
//         },
//         { new: true, runValidators: true }
//     );

//     if (!hunt) {
//         throw new ApiError(404, 'Hunt not found');
//     }

//     await redis.del(`leaderboard_${huntId}`);
//     res.status(201).json(new ApiResponse(201, hunt, 'Joined event successfully'));
// });

const getLeaderboard = asyncHandler(async (req, res) => {
    const { huntId } = req.params;
    
    if (!huntId) {
        throw new ApiError(400, "Hunt ID is required");
    }

    const hunt = await HuntModel.findById(huntId)
        .populate({
            path: 'participants.user',
            select: 'firstName lastName email'
        })
        .select('participants');
        console.log(hunt)

    if (!hunt) {
        throw new ApiError(404, "Hunt not found");
    }

    // Transform and sort participants
    const leaderboard = hunt.participants
        .map(participant => ({
            userName: `${participant.user.firstName} ${participant.user.lastName}`,
            email: participant.user.email,
            points: participant.points,
            puzzlesSolved: participant.guesses.length,
            hintsUsed: participant.guesses.reduce((total, guess) => total + guess.hintsOpened, 0),
            lastAttempt: participant.guesses.length > 0 
                ? participant.guesses[participant.guesses.length - 1].timestamp 
                : null
        }))
        .sort((a, b) => {
            // Sort by points in descending order
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            // If points are equal, sort by puzzles solved
            if (b.puzzlesSolved !== a.puzzlesSolved) {
                return b.puzzlesSolved - a.puzzlesSolved;
            }
            // If puzzles solved are equal, sort by hints used (fewer hints is better)
            if (a.hintsUsed !== b.hintsUsed) {
                return a.hintsUsed - b.hintsUsed;
            }
            // If everything is equal, sort by last attempt time
            return a.lastAttempt && b.lastAttempt 
                ? a.lastAttempt - b.lastAttempt 
                : 0;
        })
        .map((participant, index) => ({
            rank: index + 1,
            ...participant
        }));

    return res.status(200).json(
        new ApiResponse(
            200,
            { leaderboard },
            'Leaderboard fetched successfully'
        )
    );
});

// export const updateGuess = asyncHandler(async (req, res) => {
//     const { huntId, userId, puzzleId, guessedLocation, points, timeTaken } = req.body;

//     if (!huntId || !userId || !puzzleId || !guessedLocation || !points || !timeTaken) {
//         throw new ApiError(400, 'Missing required fields');
//     }

//     const hunt = await HuntModel.findOneAndUpdate(
//         {
//             _id: huntId,
//             'participants.user': userId
//         },
//         {/*  */
//             $push: {
//                 'participants.$.guesses': {
//                     puzzleId,
//                     guessedLocation,
//                     timestamp: new Date(),
//                     points
//                 }
//             },
//             $inc: {
//                 'leaderboard.$[user].score': points,
//                 'leaderboard.$[user].timeCompleted': timeTaken
//             }
//         },
//         {
//             new: true,
//             arrayFilters: [{ 'user.user': userId }],
//             runValidators: true
//         }
//     );

//     if (!hunt) {
//         throw new ApiError(404, 'Hunt or participant not found');
//     }

//     await redis.del(`leaderboard_${huntId}`);
//     res.status(200).json(new ApiResponse(200, hunt, 'Guess updated successfully'));
// });

const getScore= asyncHandler(async(req,res)=>{
    try {
        const {huntId}= req.params

    } catch (error) {
        throw new Error(error)
    }
    

})

export{
    getLeaderboard,
    getScore
};
