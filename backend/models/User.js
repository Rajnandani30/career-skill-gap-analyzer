const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        // Career and account preferences
        targetRole: {
            type: String,
            default: "Full Stack Developer",
            trim: true
        },

        // Notification preferences
        notifications: {
            type: Boolean,
            default: true
        },

        emailUpdates: {
            type: Boolean,
            default: true
        },

        // Appearance preference
        darkMode: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;