import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { HuntModel } from "../models/hunt.models.js";

const createHunt = asyncHandler(async(req,res)=>{
    const{name, description, puzzles, startTime, endTime ,createdBy}= req.body
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
        name, description, puzzles, startTime, endTime ,createdBy
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
     
        
        return res.status(200)
        .json(new ApiResponse(200,{huntId:hunt._id, participantsCount: hunt.participants.length, puzzles: huntPuzzles}, "User participated sucessfully in the hunt"))
} catch (error) {
    throw new Error(error)
}

})

const submitGuess = asyncHandler(async (req, res) => {
    try {
        const { huntId, userId, puzzleId, guessedLocation, timeTaken } = req.body;
        if (!huntId || !userId || !puzzleId || !guessedLocation || !timeTaken) {
            throw new ApiError(400, 'Missing required fields');
        }

        const hunt = await HuntModel.findById(huntId);
        if (!hunt) {
            throw new ApiError(404, 'Hunt not found');
        }

        const puzzle = hunt.puzzles.id(puzzleId);
        if (!puzzle) {
            throw new ApiError(404, 'Puzzle not found');
        }

        let imageUrl = '';
        if (puzzle.photoReq) {
            const huntImagePath = req.files?.image?.[0]?.path;
            if (!huntImagePath) {
                throw new ApiError(400, "Image is required for this puzzle");
            }

            const uploadImage = await uploadOnCloudinary(huntImagePath);
            if (!uploadImage) {
                throw new ApiError(500, "Failed to upload image to Cloudinary");
            }
            imageUrl = uploadImage.url;
        }

        const accuracyMargin = 10; // 10 meters

        const { coordinates: originalCoordinates } = puzzle.location; 

        const distance = calculateDistance(guessedLocation, originalCoordinates);
        if (distance > accuracyMargin) {
            throw new ApiError(400, "Guess location is not accurate enough");
        }

        let participant = hunt.participants.find((p) => p.user.toString() === userId);
        if (!participant) {
            participant = { user: userId, guesses: [] };
            hunt.participants.push(participant);
        }

        participant.guesses.push({
            guessedLocation: {
                coordinates: guessedLocation,
            },
            imageUrl,
            timestamp: new Date()
        });

        await hunt.save();

        

        return res.status(200).json(new ApiResponse('Guess submitted successfully', { imageUrl }));
    } catch (error) {
        throw new Error(error);
    }
});

const calculateDistance = (coords1, coords2) => {
    const R = 6371e3; // Earth's radius in meters
    const lat1 = (coords1.lat * Math.PI) / 180;
    const lat2 = (coords2.lat * Math.PI) / 180;
    const deltaLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
    const deltaLng = ((coords2.lng - coords1.lng) * Math.PI) / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};

const yourHunts= asyncHandler(async(req, res)=>{
try {
        const createdBy= req.user._id
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

const getParticipant= asyncHandler(async(req,res)=>{
    try {
        const { huntId } = req.params;
        const userId = req.user._id;

        const hunt = await HuntModel.findOne({ _id: huntId, createdBy: userId }).populate('participants.user', 'guesses.imageUrl');
        if (!hunt) {
            throw new ApiError(404, "Hunt not found or you're not authorized to view participants.");
        }

        return res.status(200).json(new ApiResponse(200, hunt.participants, "Participants fetched successfully"));
    
}catch (error) {
   throw new Error(error) 
}
})


export{
    createHunt,
    getLiveHunts,
    getUpcomingEvents,
    participate,
    yourHunts,
    submitGuess,
    getParticipant
}