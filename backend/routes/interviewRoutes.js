const express = require("express");
const Analysis = require("../models/Analysis");
const authMiddleware = require("../middleware/authMiddleware");
const {
    generateInterviewPreparation
} = require("../services/aiService");

const router = express.Router();

/*
 * Generate personalized AI interview preparation.
 *
 * POST /api/interview
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

        const interviewPreparation =
            await generateInterviewPreparation({
                targetRole: analysis.targetRole,
                userSkills: analysis.userSkills || [],
                missingSkills: analysis.missingSkills || [],
                jobDescription: analysis.jobDescription
            });

        res.status(201).json({
            success: true,
            message:
                "AI interview preparation generated successfully.",
            interview: interviewPreparation
        });

    } catch (error) {
        console.error(
            "Generate interview preparation error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to generate interview preparation.",
            error: error.message
        });
    }
});

module.exports = router;