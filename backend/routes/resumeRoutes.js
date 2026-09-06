const express = require("express");
const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE a resume
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, resumeText } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Resume title is required."
            });
        }

        if (!resumeText || resumeText.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Resume text is required."
            });
        }

        const resume = await Resume.create({
            userId: req.userId,
            title: title.trim(),
            resumeText: resumeText.trim()
        });

        res.status(201).json({
            success: true,
            message: "Resume saved successfully.",
            resume
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to save resume.",
            error: error.message
        });
    }
});

// GET all resumes of logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const resumes = await Resume.find({
            userId: req.userId
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            resumes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch resumes.",
            error: error.message
        });
    }
});

// GET one resume
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found."
            });
        }

        res.json({
            success: true,
            resume
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch resume.",
            error: error.message
        });
    }
});

// UPDATE a resume
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, resumeText } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Resume title is required."
            });
        }

        if (!resumeText || resumeText.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Resume text is required."
            });
        }

        const resume = await Resume.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            {
                title: title.trim(),
                resumeText: resumeText.trim()
            },
            {
                new: true
            }
        );

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found."
            });
        }

        res.json({
            success: true,
            message: "Resume updated successfully.",
            resume
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update resume.",
            error: error.message
        });
    }
});

// DELETE a resume
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found."
            });
        }

        res.json({
            success: true,
            message: "Resume deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete resume.",
            error: error.message
        });
    }
});

module.exports = router;