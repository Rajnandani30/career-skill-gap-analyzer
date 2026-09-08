const express = require("express");
const Analysis = require("../models/Analysis");
const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
 * CREATE ANALYSIS
 * Saves a resume + job description analysis
 */
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            resumeId,
            targetRole,
            jobDescription,
            userSkills,
            requiredSkills,
            matchedSkills,
            missingSkills,
            matchScore,
            analysisSummary
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

        // Make sure the resume belongs to the logged-in user
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

        const analysis = await Analysis.create({
            userId: req.userId,
            resumeId,
            targetRole: targetRole.trim(),
            jobDescription: jobDescription.trim(),
            userSkills: userSkills || [],
            requiredSkills: requiredSkills || [],
            matchedSkills: matchedSkills || [],
            missingSkills: missingSkills || [],
            matchScore: matchScore || 0,
            analysisSummary: analysisSummary || ""
        });

        res.status(201).json({
            success: true,
            message: "Analysis saved successfully.",
            analysis
        });
    } catch (error) {
        console.error(
            "Create analysis error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to save analysis.",
            error: error.message
        });
    }
});

/*
 * GET ALL ANALYSES
 * Returns analyses belonging to logged-in user
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