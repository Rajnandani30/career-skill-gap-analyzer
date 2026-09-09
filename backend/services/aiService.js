const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


/*
 * =========================================================
 * ANALYZE RESUME AGAINST TARGET JOB
 * =========================================================
 */
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
        console.error(
            "Invalid Gemini JSON:",
            output
        );

        throw new Error(
            "AI returned an invalid analysis format."
        );
    }
};


/*
 * =========================================================
 * GENERATE PERSONALIZED AI LEARNING ROADMAP
 * =========================================================
 */
const generateLearningRoadmap = async ({
    targetRole,
    missingSkills
}) => {

    const prompt = `
You are CareerAI, an expert career mentor, technical instructor,
and beginner-friendly learning advisor.

Your task is to create a detailed and practical learning roadmap
for a student who wants to become a ${targetRole}.

The learner has the following identified skill gaps:

${missingSkills.join(", ")}

IMPORTANT:

Do NOT simply list topics.

The learner should be able to follow your roadmap step by step
even if they are a complete beginner.

Explain what they should learn, why they should learn it,
how they should practice it, what they should build,
and what they should be able to do after completing each stage.

Return ONLY valid JSON.

Use EXACTLY this structure:

{
    "roadmap": [
        {
            "skill": "",
            "priority": "",
            "whyItMatters": "",
            "beginnerExplanation": "",
            "estimatedTime": "",
            "steps": [
                {
                    "stepNumber": 1,
                    "title": "",
                    "whatToLearn": "",
                    "howToLearn": "",
                    "practiceTask": ""
                }
            ],
            "practiceExercises": [],
            "project": "",
            "projectSteps": [],
            "expectedOutcome": ""
        }
    ]
}

DETAILED RULES:

1. ROADMAP SKILLS

Create one roadmap section for every important missing skill.

If there are multiple missing skills, each skill must have
its own complete learning plan.

Do not combine unrelated skills into one section.


2. PRIORITY

priority must be exactly one of:

"High"
"Medium"
"Low"

Use High for skills that are especially important for the
target job.


3. WHY IT MATTERS

Explain in simple language why the skill is important for the
target role.

Connect the explanation to real-world software development
and actual job responsibilities.


4. BEGINNER EXPLANATION

Assume the learner has little or no knowledge of the skill.

Explain:

- What the skill is.
- What problem it solves.
- Where it is used.
- Why developers use it.
- A simple example of how it works.

Avoid assuming advanced technical knowledge.

Use simple language suitable for a college student.


5. ESTIMATED TIME

Give a realistic learning duration.

Examples:

"1-2 weeks"
"2-3 weeks"
"3-4 weeks"

The duration should match the amount of material being taught.


6. LEARNING STEPS

Create 6 to 8 detailed steps for EVERY skill.

The steps must progress from:

Beginner fundamentals
→ Basic practice
→ Intermediate concepts
→ Real-world usage
→ Debugging/problem solving
→ Integration
→ Portfolio project preparation

Every step MUST contain:

stepNumber
title
whatToLearn
howToLearn
practiceTask


7. WHAT TO LEARN

Explain the concept that the learner needs to understand.

Include important terminology where appropriate.

Explain technical words in simple language.


8. HOW TO LEARN

This is extremely important.

Give concrete instructions about what the learner should do.

For example:

- What concepts to study first.
- What small examples to create.
- What tools to install or use.
- What commands or features to practice.
- What mistakes to intentionally create.
- How to inspect errors.
- How to test the result.
- How to move from a small example to a real application.

Do NOT write vague instructions such as:

"Learn debugging."

Instead explain exactly how the learner should practice debugging.


9. PRACTICE TASK

Give a small hands-on task that can be completed after
each learning step.

The task should allow the learner to verify that they
actually understood the concept.


10. PRACTICE EXERCISES

Provide 4 to 6 additional exercises for each skill.

Exercises should gradually become more difficult.

At least one exercise should resemble a real job task.


11. PORTFOLIO PROJECT

Give one realistic project that uses the skill.

The project should be suitable for a student portfolio
or GitHub repository.

Avoid overly complicated projects that a beginner cannot finish.


12. PROJECT STEPS

Give 6 to 8 detailed steps explaining how to build the project.

Each step should explain what the learner should actually do.

The project should progress from setup to implementation,
testing, debugging, and final documentation.


13. EXPECTED OUTCOME

Explain clearly what the learner should be able to do
after completing the roadmap section.

Mention practical abilities rather than simply saying
"you learned the skill."


14. REAL-WORLD FOCUS

The roadmap should prepare the learner for internships,
entry-level jobs, projects, and technical interviews.

Include practical development habits where appropriate:

- reading documentation
- debugging
- testing
- Git/GitHub
- writing clean code
- handling errors
- understanding existing code
- building projects


15. BEGINNER-FRIENDLY LANGUAGE

Use simple and encouraging language.

Explain difficult concepts before expecting the learner
to use them.

Do not assume the learner already understands advanced
programming concepts.


16. ORDER

Order roadmap sections from highest priority to lowest priority.

Within each skill, order the learning steps from easiest
to more advanced.


17. PRACTICAL BALANCE

Do not make the roadmap purely theoretical.

For every major concept, provide something the learner
can actually practice or build.


18. NO MARKDOWN

Return plain JSON only.

Do not use markdown.

Do not include explanations outside the JSON.


19. JSON FORMAT

Do not add fields other than the fields specified
in the required JSON structure.

Make sure the response is valid JSON.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    const output = response.text;

    try {
        return JSON.parse(output);
    } catch (error) {
        console.error(
            "Invalid Gemini roadmap JSON:",
            output
        );

        throw new Error(
            "AI returned an invalid roadmap format."
        );
    }
};

/*
 * =========================================================
 * GENERATE AI INTERVIEW PREPARATION
 * =========================================================
 */
const generateInterviewPreparation = async ({
    targetRole,
    userSkills,
    missingSkills,
    jobDescription
}) => {

    const prompt = `
You are CareerAI, an expert technical interviewer and career mentor.

Create a personalized interview preparation plan for a student
applying for the following role:

TARGET ROLE:
${targetRole}

CANDIDATE SKILLS:
${userSkills.join(", ")}

SKILL GAPS:
${missingSkills.join(", ")}

JOB DESCRIPTION:
${jobDescription}

The interview preparation should be practical and personalized
to the candidate and the target role.

Return ONLY valid JSON.

Use EXACTLY this structure:

{
    "technicalQuestions": [
        {
            "question": "",
            "topic": "",
            "difficulty": "",
            "answer": "",
            "tip": ""
        }
    ],
    "scenarioQuestions": [
        {
            "question": "",
            "answer": "",
            "tip": ""
        }
    ],
    "behavioralQuestions": [
        {
            "question": "",
            "answer": "",
            "tip": ""
        }
    ],
    "preparationTips": []
}

RULES:

1. TECHNICAL QUESTIONS

Generate 6 technical interview questions relevant to the
target role.

Focus on technologies, concepts, and skills mentioned in
the job description.

Include questions related to the candidate's skill gaps
where appropriate.

difficulty must be exactly one of:

"Easy"
"Medium"
"Hard"


2. TECHNICAL ANSWERS

Provide a clear and beginner-friendly model answer for
every technical question.

Explain the concept instead of giving only a one-line answer.


3. SCENARIO QUESTIONS

Generate 4 practical software-development scenario questions.

Examples of scenarios include:

- debugging an application
- handling an API failure
- database problems
- working with an unfamiliar codebase
- resolving a production issue
- handling conflicting requirements

Give a practical model answer for every question.


4. BEHAVIORAL QUESTIONS

Generate 4 common behavioral interview questions suitable
for a college student or entry-level candidate.

Examples:

- Tell me about yourself.
- Describe a challenging project.
- How do you handle mistakes?
- How do you work in a team?

Provide a professional example answer for every question.


5. PERSONALIZATION

Use the candidate's actual skills and skill gaps when creating
questions.

Do not generate completely generic questions if the provided
information allows personalization.


6. INTERVIEW TIPS

Provide 6 practical preparation tips.

Include advice about:

- explaining projects
- communicating technical decisions
- debugging
- answering unknown questions
- discussing Git/GitHub
- explaining real-world development experience


7. BEGINNER-FRIENDLY LANGUAGE

The candidate is a college student preparing for internships
or entry-level jobs.

Use simple language and explain technical concepts clearly.


8. NO MARKDOWN

Return plain JSON only.

Do not include markdown.

Do not include explanations outside the JSON.


9. JSON FORMAT

Do not add fields other than the fields specified above.

Make sure the response is valid JSON.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    const output = response.text;

    try {
        return JSON.parse(output);
    } catch (error) {
        console.error(
            "Invalid Gemini interview JSON:",
            output
        );

        throw new Error(
            "AI returned an invalid interview preparation format."
        );
    }
};


/*
 * =========================================================
 * EXPORT AI FUNCTIONS
 * =========================================================
 */

module.exports = {
    analyzeCareerFit,
    generateLearningRoadmap,
    generateInterviewPreparation
};