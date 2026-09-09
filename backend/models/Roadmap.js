const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        analysisId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Analysis",
            required: true
        },

        targetRole: {
            type: String,
            required: true,
            trim: true
        },

        skills: {
            type: [String],
            default: []
        },

        roadmap: {
            type: mongoose.Schema.Types.Mixed,
            default: []
        }
    },
    {
        timestamps: true
    }
);

const Roadmap = mongoose.model(
    "Roadmap",
    roadmapSchema
);

module.exports = Roadmap;