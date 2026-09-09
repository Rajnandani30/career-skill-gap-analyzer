const express = require("express");
const Roadmap = require("../models/Roadmap");
const Analysis = require("../models/Analysis");
const authMiddleware = require("../middleware/authMiddleware");
const {
    generateLearningRoadmap
} = require("../services/aiService");

const router = express.Router();

/*
 * Generate and save a personalized AI learning roadmap.
 *
 * POST /api/roadmap
 */
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            analysisId
        } = req.body;

        if (!analysisId) {
            return res.status(400).json({
                success: false,
                message: "Analysis ID is required."
            });
        }

        /*
         * Find the analysis and make sure it
         * belongs to the logged-in user.
         */
        const analysis = await Analysis.findOne({
            _id: analysisId,
            userId: req.userId
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found."
            });
        }

        /*
         * If a roadmap already exists for this
         * analysis, return the saved roadmap.
         */
        const existingRoadmap = await Roadmap.findOne({
            analysisId,
            userId: req.userId
        });

        if (existingRoadmap) {
            return res.status(200).json({
                success: true,
                message:
                    "This learning roadmap already exists.",
                roadmap: existingRoadmap
            });
        }

        /*
         * Make sure there are skill gaps to work on.
         */
        const missingSkills =
            analysis.missingSkills || [];

        if (missingSkills.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "No skill gaps were found. You are already well matched for this role."
            });
        }

        /*
         * Ask Gemini to create the personalized
         * learning roadmap.
         */
        const aiRoadmap =
            await generateLearningRoadmap({
                targetRole:
                    analysis.targetRole,

                missingSkills
            });

        /*
         * Save the AI-generated roadmap
         * in MongoDB.
         */
        const roadmap = await Roadmap.create({
            userId: req.userId,

            analysisId:
                analysis._id,

            targetRole:
                analysis.targetRole,

            skills:
                missingSkills,

            roadmap:
                aiRoadmap.roadmap || []
        });

        res.status(201).json({
            success: true,
            message:
                "AI learning roadmap generated and saved successfully.",
            roadmap
        });

    } catch (error) {
        console.error(
            "Generate roadmap error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to generate learning roadmap.",
            error: error.message
        });
    }
});


/*
 * Get all saved roadmaps for the logged-in user.
 *
 * GET /api/roadmap
 */
router.get("/", authMiddleware, async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({
            userId: req.userId
        })
            .populate(
                "analysisId",
                "targetRole matchScore"
            )
            .sort({
                createdAt: -1
            });

        res.json({
            success: true,
            roadmaps
        });

    } catch (error) {
        console.error(
            "Get roadmaps error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch learning roadmaps.",
            error: error.message
        });
    }
});


/*
 * Get one roadmap.
 *
 * GET /api/roadmap/:id
 */
router.get(
    "/:id",
    authMiddleware,
    async (req, res) => {
        try {
            const roadmap =
                await Roadmap.findOne({
                    _id: req.params.id,
                    userId: req.userId
                }).populate(
                    "analysisId",
                    "targetRole matchScore"
                );

            if (!roadmap) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Learning roadmap not found."
                });
            }

            res.json({
                success: true,
                roadmap
            });

        } catch (error) {
            console.error(
                "Get roadmap error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch learning roadmap.",
                error: error.message
            });
        }
    }
);


module.exports = router;