import { useState } from "react";

function AnalysisResults({ analysis }) {
    const [roadmap, setRoadmap] = useState(null);
    const [roadmapLoading, setRoadmapLoading] = useState(false);

    const [interview, setInterview] = useState(null);
    const [interviewLoading, setInterviewLoading] = useState(false);

    if (!analysis) {
        return null;
    }

    const {
        matchScore = 0,
        matchedSkills = [],
        missingSkills = [],
        analysisSummary = ""
    } = analysis;

    /*
     * =========================================================
     * GENERATE AI LEARNING ROADMAP
     * =========================================================
     */
    const handleRoadmapClick = async () => {
        if (roadmapLoading) {
            return;
        }

        try {
            const token =
                localStorage.getItem("careerAI_token");

            if (!token) {
                alert("Please log in again.");
                return;
            }

            if (!analysis._id) {
                alert(
                    "Analysis information is missing. Please run the analysis again."
                );
                return;
            }

            if (missingSkills.length === 0) {
                alert(
                    "No skill gaps were found. You are already well matched for this role!"
                );
                return;
            }

            setRoadmapLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/roadmap",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        analysisId: analysis._id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                        "Failed to generate learning roadmap."
                );
                return;
            }

            if (!data.roadmap) {
                alert(
                    "Learning roadmap was not returned. Please try again."
                );
                return;
            }

            setRoadmap(data.roadmap);

            console.log(
                "AI Learning Roadmap:",
                data.roadmap
            );

            setTimeout(() => {
                const roadmapSection =
                    document.getElementById(
                        "learning-roadmap"
                    );

                if (roadmapSection) {
                    roadmapSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }, 100);

        } catch (error) {
            console.error(
                "Learning roadmap error:",
                error
            );

            alert(
                "Unable to connect to the CareerAI server. Please make sure the backend is running."
            );
        } finally {
            setRoadmapLoading(false);
        }
    };


    /*
     * =========================================================
     * GENERATE AI INTERVIEW PREPARATION
     * =========================================================
     */
    const handleInterviewClick = async () => {
        if (interviewLoading) {
            return;
        }

        try {
            const token =
                localStorage.getItem("careerAI_token");

            if (!token) {
                alert(
                    "Your session has expired. Please log in again."
                );
                return;
            }

            if (!analysis || !analysis._id) {
                alert(
                    "Analysis information is missing. Please run the career analysis again."
                );
                return;
            }

            if (
                !analysis.targetRole ||
                analysis.targetRole.trim() === ""
            ) {
                alert(
                    "Target job role is missing. Please run the career analysis again."
                );
                return;
            }

            setInterviewLoading(true);

            console.log(
                "Starting AI Interview Preparation..."
            );

            console.log(
                "Analysis ID:",
                analysis._id
            );

            console.log(
                "Target Role:",
                analysis.targetRole
            );

            const response = await fetch(
                "http://localhost:5000/api/interview",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        analysisId: analysis._id
                    })
                }
            );

            const data = await response.json();

            console.log(
                "Interview API Response:",
                data
            );

            if (!response.ok) {
                alert(
                    data.message ||
                        "Failed to generate interview preparation."
                );
                return;
            }

            if (!data.interview) {
                alert(
                    "The AI interview preparation was not returned. Please try again."
                );
                return;
            }

            setInterview(data.interview);

            console.log(
                "AI Interview Preparation generated successfully:",
                data.interview
            );

            setTimeout(() => {
                const interviewSection =
                    document.getElementById(
                        "interview-preparation"
                    );

                if (interviewSection) {
                    interviewSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }, 100);

        } catch (error) {
            console.error(
                "Interview preparation error:",
                error
            );

            alert(
                "Unable to connect to the CareerAI server. Please make sure the backend is running."
            );
        } finally {
            setInterviewLoading(false);
        }
    };


    return (
        <section
            className="analysis-results"
            id="analysis-results"
        >

            {/* =================================================
                CAREER ANALYSIS HEADER
            ================================================= */}
            <div className="analysis-results-header">
                <div>
                    <span className="analysis-eyebrow">
                        ✦ AI Career Intelligence
                    </span>

                    <h2>
                        Career Analysis Results
                    </h2>

                    <p>
                        AI-powered comparison of your resume
                        against the selected job requirements.
                    </p>
                </div>

                <div className="analysis-score">
                    <span>
                        Career Match
                    </span>

                    <strong>
                        {matchScore}%
                    </strong>
                </div>
            </div>


            {/* =================================================
                AI SUMMARY
            ================================================= */}
            <div className="analysis-summary-card">
                <div className="analysis-section-icon">
                    🤖
                </div>

                <div>
                    <h3>
                        AI Career Summary
                    </h3>

                    <p>
                        {analysisSummary ||
                            "No summary available."}
                    </p>
                </div>
            </div>


            {/* =================================================
                MATCHED + MISSING SKILLS
            ================================================= */}
            <div className="analysis-skills-grid">

                {/* MATCHED SKILLS */}
                <div className="analysis-skill-card matched-card">

                    <div className="analysis-card-header">
                        <div>
                            <span className="analysis-card-icon">
                                ✓
                            </span>

                            <h3>
                                Matched Skills
                            </h3>
                        </div>

                        <strong>
                            {matchedSkills.length}
                        </strong>
                    </div>

                    {matchedSkills.length > 0 ? (
                        <div className="skill-tags">
                            {matchedSkills.map(
                                (skill, index) => (
                                    <span
                                        className="skill-tag matched-tag"
                                        key={`${skill}-${index}`}
                                    >
                                        ✓ {skill}
                                    </span>
                                )
                            )}
                        </div>
                    ) : (
                        <p className="no-skills">
                            No matched skills found.
                        </p>
                    )}
                </div>


                {/* SKILL GAPS */}
                <div className="analysis-skill-card missing-card">

                    <div className="analysis-card-header">
                        <div>
                            <span className="analysis-card-icon">
                                !
                            </span>

                            <h3>
                                Skill Gaps
                            </h3>
                        </div>

                        <strong>
                            {missingSkills.length}
                        </strong>
                    </div>

                    {missingSkills.length > 0 ? (
                        <div className="skill-tags">
                            {missingSkills.map(
                                (skill, index) => (
                                    <span
                                        className="skill-tag missing-tag"
                                        key={`${skill}-${index}`}
                                    >
                                        ! {skill}
                                    </span>
                                )
                            )}
                        </div>
                    ) : (
                        <p className="no-skills">
                            No major skill gaps found.
                        </p>
                    )}
                </div>

            </div>


            {/* =================================================
                NEXT ACTIONS
            ================================================= */}
            <div className="analysis-next-step">

                <div>
                    <span>
                        🚀
                    </span>

                    <div>
                        <h3>
                            Ready for your next step?
                        </h3>

                        <p>
                            Use your skill gaps to build
                            a personalized learning roadmap
                            and prepare for interviews.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleRoadmapClick}
                    disabled={roadmapLoading}
                >
                    {roadmapLoading
                        ? "Generating Roadmap..."
                        : "View Learning Roadmap →"}
                </button>

            </div>


            {/* =================================================
                LEARNING ROADMAP
            ================================================= */}
            {roadmap &&
                roadmap.roadmap &&
                roadmap.roadmap.length > 0 && (

                    <div
                        className="learning-roadmap"
                        id="learning-roadmap"
                    >

                        <div className="learning-roadmap-header">

                            <div>
                                <span className="analysis-eyebrow">
                                    ✦ Personalized AI Plan
                                </span>

                                <h2>
                                    📚 Your Learning Roadmap
                                </h2>

                                <p>
                                    A detailed learning plan created
                                    specifically for your{" "}
                                    <strong>
                                        {roadmap.targetRole}
                                    </strong>{" "}
                                    career goal.
                                </p>
                            </div>

                            <div className="roadmap-skill-count">
                                <strong>
                                    {roadmap.roadmap.length}
                                </strong>

                                <span>
                                    Skill
                                    {roadmap.roadmap.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    to Learn
                                </span>
                            </div>

                        </div>


                        <div className="roadmap-list">

                            {roadmap.roadmap.map(
                                (item, index) => (

                                    <div
                                        className="roadmap-item"
                                        key={`${item.skill}-${index}`}
                                    >

                                        <div className="roadmap-number">
                                            {index + 1}
                                        </div>


                                        <div className="roadmap-content">

                                            <div className="roadmap-item-header">

                                                <div>
                                                    <h3>
                                                        {item.skill}
                                                    </h3>

                                                    <span
                                                        className={`roadmap-priority roadmap-${(
                                                            item.priority ||
                                                            "Medium"
                                                        ).toLowerCase()}`}
                                                    >
                                                        {item.priority ||
                                                            "Medium"}{" "}
                                                        Priority
                                                    </span>
                                                </div>

                                                <span className="roadmap-time">
                                                    ⏱{" "}
                                                    {item.estimatedTime ||
                                                        "Flexible"}
                                                </span>

                                            </div>


                                            {/* BEGINNER EXPLANATION */}
                                            {item.beginnerExplanation && (
                                                <div className="roadmap-beginner-box">

                                                    <h4>
                                                        👋 What is{" "}
                                                        {item.skill}?
                                                    </h4>

                                                    <p>
                                                        {item.beginnerExplanation}
                                                    </p>

                                                </div>
                                            )}


                                            {/* WHY IT MATTERS */}
                                            {item.whyItMatters && (
                                                <div className="roadmap-why-box">

                                                    <h4>
                                                        🎯 Why this skill matters
                                                    </h4>

                                                    <p>
                                                        {item.whyItMatters}
                                                    </p>

                                                </div>
                                            )}


                                            {/* STEP BY STEP PLAN */}
                                            {item.steps &&
                                                item.steps.length > 0 && (

                                                    <div className="roadmap-steps">

                                                        <div className="roadmap-subsection-title">

                                                            <span>
                                                                📖
                                                            </span>

                                                            <div>
                                                                <h4>
                                                                    Step-by-Step Learning Plan
                                                                </h4>

                                                                <p>
                                                                    Follow these steps
                                                                    in order.
                                                                </p>
                                                            </div>

                                                        </div>


                                                        <div className="roadmap-step-list">

                                                            {item.steps.map(
                                                                (
                                                                    step,
                                                                    stepIndex
                                                                ) => (

                                                                    <div
                                                                        className="roadmap-step"
                                                                        key={stepIndex}
                                                                    >

                                                                        <div className="roadmap-step-number">
                                                                            {step.stepNumber ||
                                                                                stepIndex +
                                                                                    1}
                                                                        </div>


                                                                        <div className="roadmap-step-content">

                                                                            <h4>
                                                                                {step.title}
                                                                            </h4>


                                                                            {step.whatToLearn && (
                                                                                <div className="roadmap-detail-block">

                                                                                    <strong>
                                                                                        📘 What to learn
                                                                                    </strong>

                                                                                    <p>
                                                                                        {step.whatToLearn}
                                                                                    </p>

                                                                                </div>
                                                                            )}


                                                                            {step.howToLearn && (
                                                                                <div className="roadmap-detail-block">

                                                                                    <strong>
                                                                                        🧭 How to learn
                                                                                    </strong>

                                                                                    <p>
                                                                                        {step.howToLearn}
                                                                                    </p>

                                                                                </div>
                                                                            )}


                                                                            {step.practiceTask && (
                                                                                <div className="roadmap-practice-task">

                                                                                    <strong>
                                                                                        🧪 Practice Task
                                                                                    </strong>

                                                                                    <p>
                                                                                        {step.practiceTask}
                                                                                    </p>

                                                                                </div>
                                                                            )}

                                                                        </div>

                                                                    </div>

                                                                )
                                                            )}

                                                        </div>

                                                    </div>
                                                )}


                                            {/* PRACTICE EXERCISES */}
                                            {item.practiceExercises &&
                                                item.practiceExercises.length >
                                                    0 && (

                                                    <div className="roadmap-exercises">

                                                        <div className="roadmap-subsection-title">

                                                            <span>
                                                                🧪
                                                            </span>

                                                            <div>
                                                                <h4>
                                                                    Practice Exercises
                                                                </h4>

                                                                <p>
                                                                    Complete these
                                                                    exercises to
                                                                    strengthen your
                                                                    understanding.
                                                                </p>
                                                            </div>

                                                        </div>


                                                        <ol>

                                                            {item.practiceExercises.map(
                                                                (
                                                                    exercise,
                                                                    exerciseIndex
                                                                ) => (

                                                                    <li
                                                                        key={
                                                                            exerciseIndex
                                                                        }
                                                                    >
                                                                        <span>
                                                                            {exercise}
                                                                        </span>
                                                                    </li>

                                                                )
                                                            )}

                                                        </ol>

                                                    </div>
                                                )}


                                            {/* PORTFOLIO PROJECT */}
                                            {item.project && (
                                                <div className="roadmap-project">

                                                    <strong>
                                                        🛠 Portfolio Project
                                                    </strong>

                                                    <p>
                                                        {item.project}
                                                    </p>

                                                </div>
                                            )}


                                            {/* PROJECT STEPS */}
                                            {item.projectSteps &&
                                                item.projectSteps.length >
                                                    0 && (

                                                    <div className="roadmap-project-steps">

                                                        <div className="roadmap-subsection-title">

                                                            <span>
                                                                🚀
                                                            </span>

                                                            <div>
                                                                <h4>
                                                                    How to Build the Project
                                                                </h4>

                                                                <p>
                                                                    Follow these steps
                                                                    to turn your learning
                                                                    into a real project.
                                                                </p>
                                                            </div>

                                                        </div>


                                                        <ol>

                                                            {item.projectSteps.map(
                                                                (
                                                                    projectStep,
                                                                    projectIndex
                                                                ) => (

                                                                    <li
                                                                        key={
                                                                            projectIndex
                                                                        }
                                                                    >

                                                                        <span className="project-step-number">
                                                                            {projectIndex +
                                                                                1}
                                                                        </span>

                                                                        <span>
                                                                            {projectStep}
                                                                        </span>

                                                                    </li>

                                                                )
                                                            )}

                                                        </ol>

                                                    </div>
                                                )}


                                            {/* EXPECTED OUTCOME */}
                                            {item.expectedOutcome && (
                                                <div className="roadmap-outcome">

                                                    <strong>
                                                        🎓 Expected Outcome
                                                    </strong>

                                                    <p>
                                                        {item.expectedOutcome}
                                                    </p>

                                                </div>
                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>
                )}


            {/* =================================================
                INTERVIEW PREPARATION CTA
            ================================================= */}
            <div className="interview-prep-cta">

                <div className="interview-prep-cta-content">

                    <div className="interview-prep-icon">
                        🎤
                    </div>

                    <div>
                        <span className="analysis-eyebrow">
                            ✦ AI Interview Coach
                        </span>

                        <h3>
                            Prepare for Your Interview
                        </h3>

                        <p>
                            Get personalized technical,
                            scenario-based, and behavioral
                            interview questions based on
                            your target role, skills, and
                            identified skill gaps.
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    onClick={handleInterviewClick}
                    disabled={interviewLoading}
                >
                    {interviewLoading
                        ? "Generating Interview Prep..."
                        : "🎤 Start Interview Prep →"}
                </button>

            </div>


            {/* =================================================
                INTERVIEW PREPARATION RESULTS
            ================================================= */}
            {interview && (

                <section
                    className="interview-preparation"
                    id="interview-preparation"
                >

                    {/* HEADER */}
                    <div className="interview-header">

                        <div>
                            <span className="analysis-eyebrow">
                                ✦ Personalized AI Interview Coach
                            </span>

                            <h2>
                                🎤 Interview Preparation
                            </h2>

                            <p>
                                Practice questions personalized
                                for your{" "}
                                <strong>
                                    {analysis.targetRole}
                                </strong>{" "}
                                role.
                            </p>
                        </div>

                        <div className="interview-count-card">
                            <strong>
                                {(
                                    interview.technicalQuestions?.length ||
                                    0
                                ) +
                                    (
                                        interview.scenarioQuestions?.length ||
                                        0
                                    ) +
                                    (
                                        interview.behavioralQuestions?.length ||
                                        0
                                    )}
                            </strong>

                            <span>
                                Practice Questions
                            </span>
                        </div>

                    </div>


                    {/* TECHNICAL QUESTIONS */}
                    {interview.technicalQuestions &&
                        interview.technicalQuestions.length > 0 && (

                            <div className="interview-section">

                                <div className="interview-section-header">

                                    <div>
                                        <span className="interview-section-icon">
                                            💻
                                        </span>

                                        <div>
                                            <h3>
                                                Technical Questions
                                            </h3>

                                            <p>
                                                Test your understanding
                                                of the technologies and
                                                concepts required for
                                                the role.
                                            </p>
                                        </div>
                                    </div>

                                    <span className="interview-section-count">
                                        {interview.technicalQuestions.length}
                                    </span>

                                </div>


                                <div className="interview-question-list">

                                    {interview.technicalQuestions.map(
                                        (item, index) => (

                                            <div
                                                className="interview-question-card"
                                                key={index}
                                            >

                                                <div className="interview-question-top">

                                                    <span className="interview-question-number">
                                                        Q{index + 1}
                                                    </span>

                                                    <span className="interview-topic">
                                                        {item.topic ||
                                                            "Technical"}
                                                    </span>

                                                    <span
                                                        className={`interview-difficulty interview-${(
                                                            item.difficulty ||
                                                            "Medium"
                                                        ).toLowerCase()}`}
                                                    >
                                                        {item.difficulty ||
                                                            "Medium"}
                                                    </span>

                                                </div>


                                                <h4>
                                                    {item.question}
                                                </h4>


                                                {item.answer && (
                                                    <div className="interview-answer">

                                                        <strong>
                                                            💡 Model Answer
                                                        </strong>

                                                        <p>
                                                            {item.answer}
                                                        </p>

                                                    </div>
                                                )}


                                                {item.tip && (
                                                    <div className="interview-tip">

                                                        <strong>
                                                            🎯 Interview Tip
                                                        </strong>

                                                        <p>
                                                            {item.tip}
                                                        </p>

                                                    </div>
                                                )}

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>
                        )}


                    {/* SCENARIO QUESTIONS */}
                    {interview.scenarioQuestions &&
                        interview.scenarioQuestions.length > 0 && (

                            <div className="interview-section">

                                <div className="interview-section-header">

                                    <div>
                                        <span className="interview-section-icon">
                                            🧩
                                        </span>

                                        <div>
                                            <h3>
                                                Scenario Questions
                                            </h3>

                                            <p>
                                                Practice solving
                                                realistic software
                                                development situations.
                                            </p>
                                        </div>
                                    </div>

                                    <span className="interview-section-count">
                                        {interview.scenarioQuestions.length}
                                    </span>

                                </div>


                                <div className="interview-question-list">

                                    {interview.scenarioQuestions.map(
                                        (item, index) => (

                                            <div
                                                className="interview-question-card scenario-question-card"
                                                key={index}
                                            >

                                                <div className="interview-question-top">

                                                    <span className="interview-question-number">
                                                        Q{index + 1}
                                                    </span>

                                                    <span className="interview-topic">
                                                        Real-World Scenario
                                                    </span>

                                                </div>


                                                <h4>
                                                    {item.question}
                                                </h4>


                                                {item.answer && (
                                                    <div className="interview-answer">

                                                        <strong>
                                                            💡 Model Approach
                                                        </strong>

                                                        <p>
                                                            {item.answer}
                                                        </p>

                                                    </div>
                                                )}


                                                {item.tip && (
                                                    <div className="interview-tip">

                                                        <strong>
                                                            🎯 Interview Tip
                                                        </strong>

                                                        <p>
                                                            {item.tip}
                                                        </p>

                                                    </div>
                                                )}

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>
                        )}


                    {/* BEHAVIORAL QUESTIONS */}
                    {interview.behavioralQuestions &&
                        interview.behavioralQuestions.length > 0 && (

                            <div className="interview-section">

                                <div className="interview-section-header">

                                    <div>
                                        <span className="interview-section-icon">
                                            👤
                                        </span>

                                        <div>
                                            <h3>
                                                Behavioral Questions
                                            </h3>

                                            <p>
                                                Prepare professional
                                                answers for common
                                                HR and behavioral
                                                interview questions.
                                            </p>
                                        </div>
                                    </div>

                                    <span className="interview-section-count">
                                        {interview.behavioralQuestions.length}
                                    </span>

                                </div>


                                <div className="interview-question-list">

                                    {interview.behavioralQuestions.map(
                                        (item, index) => (

                                            <div
                                                className="interview-question-card behavioral-question-card"
                                                key={index}
                                            >

                                                <div className="interview-question-top">

                                                    <span className="interview-question-number">
                                                        Q{index + 1}
                                                    </span>

                                                    <span className="interview-topic">
                                                        Behavioral
                                                    </span>

                                                </div>


                                                <h4>
                                                    {item.question}
                                                </h4>


                                                {item.answer && (
                                                    <div className="interview-answer">

                                                        <strong>
                                                            💡 Example Answer
                                                        </strong>

                                                        <p>
                                                            {item.answer}
                                                        </p>

                                                    </div>
                                                )}


                                                {item.tip && (
                                                    <div className="interview-tip">

                                                        <strong>
                                                            🎯 Interview Tip
                                                        </strong>

                                                        <p>
                                                            {item.tip}
                                                        </p>

                                                    </div>
                                                )}

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>
                        )}


                    {/* PREPARATION TIPS */}
                    {interview.preparationTips &&
                        interview.preparationTips.length > 0 && (

                            <div className="interview-tips-section">

                                <div className="interview-section-header">

                                    <div>
                                        <span className="interview-section-icon">
                                            💡
                                        </span>

                                        <div>
                                            <h3>
                                                Interview Preparation Tips
                                            </h3>

                                            <p>
                                                Practical advice to
                                                improve your interview
                                                performance.
                                            </p>
                                        </div>
                                    </div>

                                    <span className="interview-section-count">
                                        {interview.preparationTips.length}
                                    </span>

                                </div>


                                <div className="interview-tips-grid">

                                    {interview.preparationTips.map(
                                        (tip, index) => (

                                            <div
                                                className="interview-tip-card"
                                                key={index}
                                            >

                                                <div className="interview-tip-number">
                                                    {index + 1}
                                                </div>

                                                <p>
                                                    {tip}
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>
                        )}

                </section>
            )}

        </section>
    );
}

export default AnalysisResults;