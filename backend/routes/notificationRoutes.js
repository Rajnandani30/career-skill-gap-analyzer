const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { sendCareerAIEmail } = require("../services/emailService");

const router = express.Router();

// Send a test email to the logged-in user's registered email
router.post("/test-email", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "name email emailUpdates notifications"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.emailUpdates || !user.notifications) {
      return res.status(400).json({
        message:
          "Email notifications are disabled. Enable them in Settings first.",
      });
    }

    await sendCareerAIEmail({
      to: user.email,
      subject: "CareerAI Email Notification Test",
      title: `Hello ${user.name || "CareerAI User"}!`,
      message:
        "This is a test email from CareerAI. Your email notification system is working successfully.",
    });

    res.status(200).json({
      message: "Test email sent successfully",
      email: user.email,
    });
  } catch (error) {
    console.error("Test email error:", error);

    res.status(500).json({
      message: "Failed to send test email",
      error: error.message,
    });
  }
});

module.exports = router;