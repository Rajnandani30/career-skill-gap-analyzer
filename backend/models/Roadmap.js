const mongoose = require("mongoose");

const roadmapStepSchema = new mongoose.Schema(
    {
        stepNumber: {
            type: Number,
            required: true
        },

        title: {
            type: String,
            default: ""
        },

        whatToLearn: {
            type: String,
            default: ""
        },

        howToLearn: {
            type: String,
            default: ""
        },

        practiceTask: {
            type: String,
            default: ""
        },

        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        _id: false
    }
);

const roadmapSkillSchema = new mongoose.Schema(
    {
        skill: {
            type: String,
            required: true
        },

        priority: {
            type: String,
            default: "Medium"
        },

        whyItMatters: {
            type: String,
            default: ""
        },

        beginnerExplanation: {
            type: String,
            default: ""
        },

        estimatedTime: {
            type: String,
            default: ""
        },

        steps: {
            type: [roadmapStepSchema],
            default: []
        },

        practiceExercises: {
            type: [String],
            default: []
        },

        project: {
            type: String,
            default: ""
        },

        projectSteps: {
            type: [String],
            default: []
        },

        expectedOutcome: {
            type: String,
            default: ""
        }
    },
    {
        _id: false
    }
);

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
            type: [roadmapSkillSchema],
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