const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const analyzeCareerFit = async ({
    resumeText,
    targetRole,
    jobDescription
}) => {
    const prompt = `
You are CareerAI, an AI-powered career readiness analyzer.

Analyze the candidate's resume against the target job.

TARGET ROLE:
${targetRole}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY valid JSON.

Use exactly this structure:

{
    "userSkills": [],
    "requiredSkills": [],
    "matchedSkills": [],
    "missingSkills": [],
    "matchScore": 0,
    "analysisSummary": ""
}

Rules:
- userSkills: important technical and professional skills found in the resume.
- requiredSkills: important skills required by the job description.
- matchedSkills: skills present in both the resume and job requirements.
- missingSkills: important job skills missing from the resume.
- matchScore: overall percentage from 0 to 100.
- analysisSummary: a short professional explanation of the candidate's fit.
- Keep skill names concise.
- Do not include markdown.
- Do not include extra fields.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    const output = response.text;

    try {
        return JSON.parse(output);
    } catch (error) {
        console.error("Invalid Gemini JSON:", output);
        throw new Error("AI returned an invalid analysis format.");
    }
};

module.exports = {
    analyzeCareerFit
};