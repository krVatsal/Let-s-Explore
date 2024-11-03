import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import redis from 'ioredis';
import { HuntModel } from "../models/hunt.models.js";

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

    const cachedLeaderboard = await redis.get(`leaderboard_${huntId}`);
    if (cachedLeaderboard) {
        return res.status(200).json(new ApiResponse(200, JSON.parse(cachedLeaderboard), 'Leaderboard fetched from cache'));
    }

    const leaderboard = await HuntModel.aggregate([
        { $match: { _id: huntId } },
        { $unwind: "$leaderboard" },
        { $sort: { "leaderboard.timeCompleted": 1, "leaderboard.score": -1 } },
        { $project: { leaderboard: 1, _id: 0 } }
    ]);

    await redis.set(`leaderboard_${huntId}`, JSON.stringify(leaderboard), 'EX', 60);
    res.status(200).json(new ApiResponse(200, leaderboard, 'Leaderboard fetched successfully'));
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
