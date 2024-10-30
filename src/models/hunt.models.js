import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    guesses: [
        {
            puzzleId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Puzzle',
                required: true
            },
            guessedLocation: {
                coordinates: { type: [Number], required: true } 
            },
            imageUrl: {
                type: String,
                default: ""
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { _id: false }); // _id: false prevents generating an extra _id for each participant entry

const huntSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return this.startTime < value;
            },
            message: "endTime must be after startTime"
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    puzzles: [
        {
            puzzleText: {
                type: String,
                required: true
            },
            location: {
                coordinates: { type: [Number], required: true } // [longitude, latitude]
            },
            hints: [
                {
                    hint: {
                        type: String,
                        default: ""
                    },
                    level: {
                        type: String,
                        enum: ['easy', 'hard'], // Specifies hint level
                        required: true
                    },
                    points: {
                        type: Number,
                        required: true,
                        validate: {
                            validator: function (value) {
                                return value > 0;
                            },
                            message: "Points must be a positive number"
                        }
                    }
                }
            ],
            photoReq: {
                type: Boolean,
                default: false
            }
        }
    ],
    participants: [participantSchema], 
    leaderboard: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            score: {
                type: Number,
                default: 0
            },
            timeCompleted: Date
        }
    ]
}, { timestamps: true });

huntSchema.index({ startTime: 1, endTime: 1 });

export const HuntModel = mongoose.model("Hunt", huntSchema);
