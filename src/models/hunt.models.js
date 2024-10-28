import mongoose from "mongoose";

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
        // required: true
    },
    puzzles: [
        {
            puzzleText: {
                type: String,
                required: true
            },
            location: {
              coordinates:{type: [Number], require: true}
            },
            hints: [
                {
                    hint: {
                        type: String,
                        default: ""
                    }
                }
            ],
            photoReq: {
                type: Boolean,
                default: false
            }
        }
    ],
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
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
