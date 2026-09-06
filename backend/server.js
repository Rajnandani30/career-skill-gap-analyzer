const express = require("express");
const cors = require("cors");
require("dotenv").config();

const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static website
app.use(express.static(path.join(__dirname, "public")));
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        message: "CareerAI backend API is working!"
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`CareerAI Backend running on http://localhost:${PORT}`);
});