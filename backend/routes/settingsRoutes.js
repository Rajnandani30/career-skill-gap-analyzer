const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
 * GET /api/settings
 * Get settings of the currently authenticated user
 */
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select(
            "-password"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            settings: {
                name: user.name,
                email: user.email,
                targetRole: user.targetRole,
                notifications: user.notifications,
                emailUpdates: user.emailUpdates,
                darkMode: user.darkMode
            }
        });
    } catch (error) {
        console.error("Get settings error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load settings."
        });
    }
});

/*
 * PUT /api/settings
 * Update settings of the currently authenticated user
 */
router.put("/", authMiddleware, async (req, res) => {
    try {
        const {
            name,
            targetRole,
            notifications,
            emailUpdates,
            darkMode
        } = req.body;

        const updateData = {};

        if (typeof name === "string" && name.trim()) {
            updateData.name = name.trim();
        }

        if (typeof targetRole === "string" && targetRole.trim()) {
            updateData.targetRole = targetRole.trim();
        }

        if (typeof notifications === "boolean") {
            updateData.notifications = notifications;
        }

        if (typeof emailUpdates === "boolean") {
            updateData.emailUpdates = emailUpdates;
        }

        if (typeof darkMode === "boolean") {
            updateData.darkMode = darkMode;
        }

        const user = await User.findByIdAndUpdate(
    req.userId,
    updateData,
    {
        returnDocument: "after",
        runValidators: true
    }
).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            message: "Settings synchronized successfully.",
            settings: {
                name: user.name,
                email: user.email,
                targetRole: user.targetRole,
                notifications: user.notifications,
                emailUpdates: user.emailUpdates,
                darkMode: user.darkMode
            }
        });
    } catch (error) {
        console.error("Update settings error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update settings."
        });
    }
});

module.exports = router;