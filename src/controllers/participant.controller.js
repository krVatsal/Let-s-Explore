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

const participate= asyncHandler(async(req,res)=>{
try {
        const {participant} = req.body
        if(!participant){
            throw new ApiError(400, "Failed to fetch participant")
        }
        const {huntId}= req.params
        const hunt= await HuntModel.findById(huntId)
        if(!hunt){
            throw new ApiError(500, "Failed to fetch the hunt")
        }
        if(hunt.participants.includes(participant)){
            throw new ApiError(400, "User already registered in the Hunt")
        }
        hunt.participants.push(participant)
        await hunt.save()

        const huntPuzzles= hunt.puzzles
        if(!huntPuzzles){
            throw new ApiError(400, "No puzzles in the hunt")
        }
        if(huntPuzzles.puzzle.photoReq){
            const huntImagePath= req.files?.image[0]?.path
            if(!huntImagePath){
                throw new ApiError(400, "Image is required for this puzzle")
            }
            const uploadImage= await uploadOnCloudinary(huntImagePath)
            if(!uploadImage){
                throw new ApiError(500, "Failed to upload image to cloudinary")
            }
            await hunt.participants.guesses.imageUrl.push(uploadImage.url)  
        }

        
        return res.status(200)
        .json(new ApiResponse(200,{huntId:hunt._id, participantsCount: hunt.participants.length, puzzles: huntPuzzles}, "User participated sucessfully in the hunt"))
} catch (error) {
    throw new Error(error)
}

})

const yourHunts= asyncHandler(async(req, res)=>{
try {
        const createdBy= req.body()
        if(!createdBy){
            throw new ApiError(500, "Failed to fetch user")
        } 
    const hunts = await HuntModel.find({createdBy})
    if(!hunts){
        throw new ApiError(404, "No hunts found")
    }
    return res.status(200)
    .json(new ApiResponse(200, hunts, "Hunts fetched sucessfully"))
} catch (error) {
    throw new Error(error)
}
})
export{
    createHunt,
    getLiveHunts,
    getUpcomingEvents,
    participate,
    yourHunts
}