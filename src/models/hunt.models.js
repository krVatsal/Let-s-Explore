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
                coordinates: {type:[String], required: true }
            },
            imageUrl: {
                type: String,
                default: ""
            },
            hintsOpened: {
                type: Number,
                required: true
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
                coordinates: {
                    type: [Number],
                    required: true,
                    validate: {
                        validator: function (coords) {
                            return coords.length === 2;
                        },
                        message: "Coordinates should include [longitude, latitude]"
                    }
                }
            },
            hints: [
                {
                    hint: {
                        type: String,
                        default: ""
                    },
                }
            ],
            photoReq: {
                type: Boolean,
                default: false
            }
        }
    ],
    participants: [participantSchema]
}, { timestamps: true });

// Custom validation for puzzles count based on level
huntSchema.path('puzzles').validate(function (puzzles) {
    const levelPuzzleLimits = {
        easy: 5,
        medium: 8,
        hard: 10
    };
    return puzzles.length <= (levelPuzzleLimits[this.level] || 0);
}, props => `Number of puzzles exceeds the limit for level ${props.instance.level}`);

// Pre-save middleware to set points based on difficulty level only for new participants
huntSchema.pre('save', function (next) {
    const levelPointsMap = {
        easy: 250,
        medium: 400,
        hard: 500
    };

    this.participants = this.participants.map(participant => {
        if (participant.points === 0) {
            return {
                ...participant,
                points: levelPointsMap[this.level] || 0
            };
        }
        return participant;
    });

    next();
});

export const HuntModel = mongoose.model("Hunt", huntSchema);
