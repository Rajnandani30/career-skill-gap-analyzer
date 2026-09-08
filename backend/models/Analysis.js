const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            required: true
        },

        targetRole: {
            type: String,
            required: true,
            trim: true
        },

        jobDescription: {
            type: String,
            required: true,
            trim: true
        },

        userSkills: {
            type: [String],
            default: []
        },

        requiredSkills: {
            type: [String],
            default: []
        },

        matchedSkills: {
            type: [String],
            default: []
        },

        missingSkills: {
            type: [String],
            default: []
        },

        matchScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        analysisSummary: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Analysis = mongoose.model(
    "Analysis",
    analysisSchema
);

module.exports = Analysis;