import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { HuntModel } from "../models/hunt.models.js";

const createHunt = asyncHandler(async(req,res)=>{
    const{name, description, puzzles, startTime, endTime }= req.body
try {
        if([name, description, puzzles, startTime, endTime ].some((field)=> field?.trim)===""){
            throw new ApiError(500, "All fields are required")
        }
        if (!puzzles || puzzles.length === 0) {
            throw new ApiError(500, "At least one puzzle is required");
        }
    
        puzzles.forEach((puzzle, index) => {
            const { puzzleText, location, hints, photoReq } = puzzle;
    
            if (!puzzleText || puzzleText.trim() === "") {
                throw new ApiError(500, `Puzzle ${index + 1}: puzzleText is required`);
            }
            // if (!photoReq ) {
            //     throw new ApiError(500, `Puzzle ${index + 1}: photoReq is required`);
            // }
            if (!location ||  location.coordinates.length !== 2 ) {
                throw new ApiError(500, `Puzzle ${index + 1}: valid location with latitude and longitude is required`);
            }
            if (!Array.isArray(hints)) {
                throw new ApiError(500, `Puzzle ${index + 1}: hints must be an array`);
            }
        });
        if(new Date(startTime)>= new Date(endTime)){
            throw new ApiError(400, "Start time must be before end time")
        }
      const hunt = await HuntModel.create({
        name, description, puzzles, startTime, endTime 
      })
      if(!hunt){
        throw new ApiError(500, "Failed to create the hunt")
      }
      return res.status(200)
      .json(new ApiResponse(200,hunt, "Hunt craeted successfully"))
} catch (error) {
    throw new Error(error)
}
})

const getLiveHunts= asyncHandler(async(req, res)=>{
    try {
        const currentTime= new Date()
        const liveHunts = await HuntModel.find({
            startTime: {$lte: currentTime},
            endTime: {$gte: currentTime},
        }).populate('createdBy', 'name')
        if(!liveHunts){
            throw new ApiError(500, "Failed to fetch live hunts")
        }

        res.status(200)
        .json(new ApiResponse(200,liveHunts, "Fetched live hunts sucessfully"))
    } catch (error) {
        throw new Error(error)
    }
})

const getUpcomingEvents= asyncHandler(async(req, res)=>{
       try {
        const currentTime= new Date()
        const upcomingEvents = await HuntModel.find({
            startTime: {$gte: currentTime}
        })
        if(!upcomingEvents){
            throw new ApiError(500, "Failed to fetch Upcoming Events")
        }
        res.status(200)
        .json(new ApiResponse(200, upcomingEvents, "Fetched upcomimg events sucessfully"))
       } catch (error) {
        throw new Error(error)
       }
})
export{
    createHunt,
    getLiveHunts,
    getUpcomingEvents
}