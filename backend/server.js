const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const path = require("path");
const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// User API routes
app.use("/api/users", userRoutes);

// Resume API routes
app.use("/api/resumes", resumeRoutes);

// Serve static website
app.use(express.static(path.join(__dirname, "public")));

// Backend status
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        message: "CareerAI backend API is working!"
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(
        `CareerAI Backend running on http://localhost:${PORT}`
    );
});