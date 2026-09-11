const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Analysis = require("../models/Analysis");
const Resume = require("../models/Resume");
const Roadmap = require("../models/Roadmap");

const authMiddleware = require("../middleware/authMiddleware");
const { sendCareerAIEmail } = require("../services/emailService");

const router = express.Router();

/*
 * =========================================================
 * REGISTER A NEW USER
 * =========================================================
 */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });
        }

        // Normalize email to prevent duplicate accounts
        const normalizedEmail = email.trim().toLowerCase();

        // Check whether the email is already registered
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered."
            });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        // Save the new account in MongoDB
        await user.save();

        /*
         * Send welcome email after successful registration.
         * If email sending fails, account creation still succeeds.
         */
        try {
            await sendCareerAIEmail({
                to: user.email,
                subject: "Welcome to CareerAI!",
                title: `Welcome to CareerAI, ${user.name}!`,
                message:
                    "Your CareerAI account has been created successfully.\n\n" +
                    "You can now explore your career analysis, identify skill gaps, " +
                    "prepare for interviews, and build your personalized learning roadmap.\n\n" +
                    "We are excited to support your career-readiness journey!"
            });

            console.log(
                `Welcome email sent successfully to ${user.email}`
            );
        } catch (emailError) {
            console.error(
                "Welcome email could not be sent:",
                emailError.message
            );
        }

        res.status(201).json({
            success: true,
            message: "Registration successful! Welcome email sent.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


/*
 * =========================================================
 * LOGIN USER
 * =========================================================
 */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Normalize email for consistent login
        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


/*
 * =========================================================
 * RESET PASSWORD
 * =========================================================
 *
 * Endpoint:
 * POST /api/users/reset-password
 *
 * Receives:
 * {
 *   email,
 *   newPassword,
 *   confirmPassword
 * }
 */
router.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        // Validate required fields
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Email, new password and confirm password are required."
            });
        }

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Check whether the passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password and confirm password do not match."
            });
        }

        // Validate password length
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });
        }

        // Find the user by email
        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email address."
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password
        user.password = hashedPassword;
        await user.save();

        /*
         * Send password-reset confirmation email.
         * If email sending fails, the password is still updated.
         */
        try {
            await sendCareerAIEmail({
                to: user.email,
                subject: "CareerAI Password Reset Confirmation",
                title: "Password Reset Successful",
                message:
                    "Your CareerAI password has been reset successfully.\n\n" +
                    "You can now log in to your CareerAI account using your new password."
            });

            console.log(
                `Password reset confirmation email sent to ${user.email}`
            );
        } catch (emailError) {
            console.error(
                "Password reset confirmation email could not be sent:",
                emailError.message
            );
        }

        // Send success response
        res.status(200).json({
            success: true,
            message:
                "Password reset successful! A confirmation email has been sent."
        });
    } catch (error) {
        console.error("Reset password error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to reset password. Please try again."
        });
    }
});


/*
 * =========================================================
 * DELETE CURRENTLY LOGGED-IN USER ACCOUNT
 * =========================================================
 *
 * Endpoint:
 * DELETE /api/users/me
 *
 * This route deletes:
 * 1. The user's analyses
 * 2. The user's resumes
 * 3. The user's roadmaps
 * 4. The user's account
 *
 * The user ID comes from the authentication token,
 * so a user cannot delete another user's account.
 */
router.delete("/me", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        // Check whether the logged-in user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found."
            });
        }

        // Delete all analyses belonging to this user
        await Analysis.deleteMany({
            userId: userId
        });

        // Delete all resumes belonging to this user
        await Resume.deleteMany({
            userId: userId
        });

        // Delete all roadmaps belonging to this user
        await Roadmap.deleteMany({
            userId: userId
        });

        // Delete the user account itself
        await User.findByIdAndDelete(userId);

        console.log(
            `Account and associated data deleted for user: ${user.email}`
        );

        res.status(200).json({
            success: true,
            message:
                "Your account and associated data have been permanently deleted."
        });
    } catch (error) {
        console.error("Delete account error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete account. Please try again."
        });
    }
});


/*
 * =========================================================
 * GET ALL USERS
 * =========================================================
 */
router.get("/", authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


/*
 * =========================================================
 * UPDATE A USER
 * =========================================================
 */
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const updateData = {
            name,
            email
        };

        // Normalize email if an email is provided
        if (email) {
            updateData.email = email.trim().toLowerCase();
        }

        // Only update password if a new password was provided
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters."
                });
            }

            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
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
            message: "User updated successfully!",
            user
        });
    } catch (error) {
        console.error("Update user error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


/*
 * =========================================================
 * DELETE A USER BY ID
 * =========================================================
 *
 * This existing route is preserved for compatibility.
 * The Settings page will use DELETE /api/users/me instead.
 */
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully!"
        });
    } catch (error) {
        console.error("Delete user error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


module.exports = router;