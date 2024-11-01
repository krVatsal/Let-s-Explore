import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    guesses: [
        {
            guessedLocation: {
                coordinates: { type: [Number], required: true } 
            },
            imageUrl: {
                type: String,
                default: ""
            },
            hintsOpened:{
                type: Number,
                require: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],
    points: {
        type: Number,
        default: 0 
    },
});

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
    level: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
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
                        enum: ['1', '2'], // Specifies hint level
                        required: true
                    }
                }
            ],
            photoReq: {
                type: Boolean,
                default: false
            }
        }
    ],
    validate: {
        validator: function (puzzles) {
            const levelPuzzleLimits = {
                easy: 5,
                medium: 8,
                hard: 10
            };
            return puzzles.length <= (levelPuzzleLimits[this.level] || 0);
        },
        message: props => `Number of puzzles exceeds the limit for level ${props.instance.level}`
    },

    participants: [participantSchema]
}, { timestamps: true });

// Index for efficient querying based on start and end times
huntSchema.index({ startTime: 1, endTime: 1 });

// Pre-save middleware to set points based on difficulty level
huntSchema.pre('save', function (next) {
    const levelPointsMap = {
        easy: 250,
        medium: 400,
        hard: 500
    };

    // If participants are newly added, initialize their points based on hunt level
    this.participants = this.participants.map(participant => ({
        ...participant,
        points: levelPointsMap[this.level] || 0
    }));

    next();
});

export const HuntModel = mongoose.model("Hunt", huntSchema);
