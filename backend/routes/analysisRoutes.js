const express = require("express");
const Analysis = require("../models/Analysis");
const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");
const { analyzeCareerFit } = require("../services/aiService");

const router = express.Router();

/*
 * CREATE ANALYSIS
 * Uses AI to analyze resume against job description
 * and saves the result in MongoDB.
 */
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            resumeId,
            targetRole,
            jobDescription
        } = req.body;

        if (!resumeId) {
            return res.status(400).json({
                success: false,
                message: "Resume ID is required."
            });
        }

        if (!targetRole || targetRole.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Target role is required."
            });
        }

        if (
            !jobDescription ||
            jobDescription.trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Job description is required."
            });
        }

        /*
         * Make sure the resume belongs to
         * the logged-in user.
         */
        const resume = await Resume.findOne({
            _id: resumeId,
            userId: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found."
            });
        }

        /*
         * Check whether the same analysis
         * already exists.
         */
        const existingAnalysis = await Analysis.findOne({
            userId: req.userId,
            resumeId,
            targetRole: targetRole.trim(),
            jobDescription: jobDescription.trim()
        });

        if (existingAnalysis) {
            return res.status(200).json({
                success: true,
                message: "This analysis already exists.",
                analysis: existingAnalysis
            });
        }

        /*
         * Send resume and job description
         * to the AI service.
         */
        try {
            const aiAnalysis = await analyzeCareerFit({
                resumeText: resume.resumeText,
                targetRole: targetRole.trim(),
                jobDescription: jobDescription.trim()
            });

            /*
             * Save the AI-generated analysis
             * in MongoDB.
             */
            const analysis = await Analysis.create({
                userId: req.userId,
                resumeId,
                targetRole: targetRole.trim(),
                jobDescription: jobDescription.trim(),

                userSkills:
                    aiAnalysis.userSkills || [],

                requiredSkills:
                    aiAnalysis.requiredSkills || [],

                matchedSkills:
                    aiAnalysis.matchedSkills || [],

                missingSkills:
                    aiAnalysis.missingSkills || [],

                matchScore:
                    aiAnalysis.matchScore || 0,

                analysisSummary:
                    aiAnalysis.analysisSummary || ""
            });

            res.status(201).json({
                success: true,
                message:
                    "AI analysis completed and saved successfully.",
                analysis
            });

        } catch (aiError) {
            console.error(
                "AI analysis error:",
                aiError
            );

            return res.status(500).json({
                success: false,
                message:
                    "AI analysis failed. Please check the AI configuration and try again."
            });
        }

    } catch (error) {
        console.error(
            "Create analysis error:",
            error
        );

        /*
         * MongoDB duplicate key error.
         *
         * This protects against duplicate records
         * if multiple requests arrive at the same time.
         */
        if (error.code === 11000) {
            return res.status(200).json({
                success: true,
                message: "This analysis already exists.",
                duplicate: true
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to save analysis.",
            error: error.message
        });
    }
});

/*
 * GET ALL ANALYSES
 * Returns analyses belonging to logged-in user.
 */
router.get("/", authMiddleware, async (req, res) => {
    try {
        const analyses = await Analysis.find({
            userId: req.userId
        })
            .populate("resumeId", "title")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            analyses
        });

    } catch (error) {
        console.error(
            "Get analyses error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch analyses.",
            error: error.message
        });
    }
});

/*
 * GET ONE ANALYSIS
 * Returns one analysis belonging to
 * the logged-in user.
 */
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const analysis = await Analysis.findOne({
            _id: req.params.id,
            userId: req.userId
        }).populate("resumeId", "title");

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found."
            });
        }

        res.json({
            success: true,
            analysis
        });

    } catch (error) {
        console.error(
            "Get analysis error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch analysis.",
            error: error.message
        });
    }
});

/*
 * DELETE ANALYSIS
 */
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const analysis =
            await Analysis.findOneAndDelete({
                _id: req.params.id,
                userId: req.userId
            });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found."
            });
        }

        res.json({
            success: true,
            message: "Analysis deleted successfully."
        });

    } catch (error) {
        console.error(
            "Delete analysis error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete analysis.",
            error: error.message
        });
    }
});

module.exports = router;