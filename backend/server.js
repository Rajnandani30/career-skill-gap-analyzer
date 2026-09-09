const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const path = require("path");
const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// User API routes
app.use("/api/users", userRoutes);

// Resume API routes
app.use("/api/resumes", resumeRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/interview", interviewRoutes);

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