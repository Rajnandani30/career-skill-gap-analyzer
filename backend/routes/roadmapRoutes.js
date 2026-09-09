const express = require("express");
const Roadmap = require("../models/Roadmap");
const Analysis = require("../models/Analysis");
const authMiddleware = require("../middleware/authMiddleware");

const {
    generateLearningRoadmap
} = require("../services/aiService");

const router = express.Router();


/*
 * =========================================================
 * GENERATE LEARNING ROADMAP
 * =========================================================
 *
 * POST /api/roadmap
 */
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { analysisId } = req.body;

        if (!analysisId) {
            return res.status(400).json({
                success: false,
                message: "Analysis ID is required."
            });
        }

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

        const existingRoadmap = await Roadmap.findOne({
            analysisId,
            userId: req.userId
        });

        if (existingRoadmap) {
            return res.status(200).json({
                success: true,
                message: "Learning roadmap already exists.",
                roadmap: existingRoadmap
            });
        }

        if (
            !analysis.missingSkills ||
            analysis.missingSkills.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "No skill gaps were found for this analysis."
            });
        }

        const generatedRoadmap =
            await generateLearningRoadmap({
                targetRole: analysis.targetRole,
                missingSkills: analysis.missingSkills
            });

        const roadmapDocument = new Roadmap({
            userId: req.userId,
            analysisId: analysis._id,
            targetRole: analysis.targetRole,
            skills: analysis.missingSkills,
            roadmap: generatedRoadmap.roadmap || []
        });

        const savedRoadmap =
            await roadmapDocument.save();

        res.status(201).json({
            success: true,
            message:
                "AI learning roadmap generated successfully.",
            roadmap: savedRoadmap
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
 * =========================================================
 * UPDATE ROADMAP STEP PROGRESS
 * =========================================================
 *
 * PATCH /api/roadmap/:roadmapId/step
 */
router.patch(
    "/:roadmapId/step",
    authMiddleware,
    async (req, res) => {
        try {
            const {
                skillIndex,
                stepIndex,
                completed
            } = req.body;

            if (
                skillIndex === undefined ||
                stepIndex === undefined ||
                completed === undefined
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Skill index, step index and completion status are required."
                });
            }

            const roadmap = await Roadmap.findOne({
                _id: req.params.roadmapId,
                userId: req.userId
            });

            if (!roadmap) {
                return res.status(404).json({
                    success: false,
                    message: "Roadmap not found."
                });
            }

            if (
                !roadmap.roadmap[skillIndex] ||
                !roadmap.roadmap[skillIndex].steps[stepIndex]
            ) {
                return res.status(404).json({
                    success: false,
                    message: "Roadmap step not found."
                });
            }

            roadmap.roadmap[
                skillIndex
            ].steps[
                stepIndex
            ].completed = Boolean(completed);

            await roadmap.save();

            res.status(200).json({
                success: true,
                message:
                    "Roadmap progress updated successfully.",
                roadmap
            });

        } catch (error) {
            console.error(
                "Update roadmap progress error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to update roadmap progress.",
                error: error.message
            });
        }
    }
);


/*
 * =========================================================
 * GET ALL ROADMAPS
 * =========================================================
 *
 * GET /api/roadmap
 */
router.get(
    "/",
    authMiddleware,
    async (req, res) => {
        try {
            const roadmaps =
                await Roadmap.find({
                    userId: req.userId
                })
                    .populate(
                        "analysisId",
                        "targetRole matchScore"
                    )
                    .sort({
                        createdAt: -1
                    });

            res.status(200).json({
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
    }
);


/*
 * =========================================================
 * GET SINGLE ROADMAP
 * =========================================================
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
                    message: "Roadmap not found."
                });
            }

            res.status(200).json({
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
                    "Failed to fetch roadmap.",
                error: error.message
            });
        }
    }
);


module.exports = router;