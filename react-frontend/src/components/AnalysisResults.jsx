import { useEffect, useState } from "react";

function AnalysisResults({ analysis, onRoadmapProgressChange }) {
    const [roadmap, setRoadmap] = useState(null);
    const [roadmapLoading, setRoadmapLoading] = useState(false);

    const [interview, setInterview] = useState(null);
    const [interviewLoading, setInterviewLoading] = useState(false);

    const [progressUpdating, setProgressUpdating] = useState(null);

    const token = localStorage.getItem("careerAI_token");


    /*
     * =========================================================
     * GENERATE LEARNING ROADMAP
     * =========================================================
     */

    const handleRoadmapClick = async () => {
        try {
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

            setRoadmap(data.roadmap);

            setTimeout(() => {
                document
                    .getElementById("learning-roadmap")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            }, 100);

        } catch (error) {
            console.error(
                "Roadmap generation error:",
                error
            );

            alert(
                "Unable to generate the learning roadmap."
            );
        } finally {
            setRoadmapLoading(false);
        }
    };


    /*
     * =========================================================
     * UPDATE ROADMAP STEP
     * =========================================================
     */

    const handleStepToggle = async (
        skillIndex,
        stepIndex
    ) => {
        if (!roadmap?._id) {
            return;
        }

        const currentStep =
            roadmap.roadmap?.[skillIndex]?.steps?.[
                stepIndex
            ];

        if (!currentStep) {
            return;
        }

        const newCompleted =
            !currentStep.completed;

        const progressKey =
            `${skillIndex}-${stepIndex}`;

        setProgressUpdating(progressKey);

        try {
            const response = await fetch(
                `http://localhost:5000/api/roadmap/${roadmap._id}/step`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        skillIndex,
                        stepIndex,
                        completed: newCompleted
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to update progress."
                );
                return;
            }

            setRoadmap(data.roadmap);

        } catch (error) {
            console.error(
                "Progress update error:",
                error
            );

            alert(
                "Unable to update learning progress."
            );
        } finally {
            setProgressUpdating(null);
        }
    };


    /*
     * =========================================================
     * CALCULATE SKILL PROGRESS
     * =========================================================
     */

    const calculateSkillProgress = (skill) => {
        const steps = skill?.steps || [];

        if (steps.length === 0) {
            return 0;
        }

        const completedSteps =
            steps.filter(
                (step) => step.completed
            ).length;

        return Math.round(
            (completedSteps / steps.length) * 100
        );
    };


    /*
     * =========================================================
     * CALCULATE OVERALL ROADMAP PROGRESS
     * =========================================================
     */

    const calculateOverallProgress = (currentRoadmap) => {
        const skillPlans = currentRoadmap?.roadmap || [];

        const allSteps = skillPlans.flatMap(
            (skillPlan) => skillPlan.steps || []
        );

        if (allSteps.length === 0) {
            return 0;
        }

        const completedSteps = allSteps.filter(
            (step) => step.completed
        ).length;

        return Math.round(
            (completedSteps / allSteps.length) * 100
        );
    };


    /*
     * =========================================================
     * SYNC ROADMAP PROGRESS WITH MAIN DASHBOARD
     * =========================================================
     */

    useEffect(() => {
        if (!onRoadmapProgressChange) {
            return;
        }

        const overallProgress =
            calculateOverallProgress(roadmap);

        onRoadmapProgressChange(overallProgress);
    }, [roadmap, onRoadmapProgressChange]);


    if (!analysis) {
        return null;
    }


    /*
     * =========================================================
     * GENERATE INTERVIEW PREPARATION
     * =========================================================
     */

    const handleInterviewClick = async () => {
        try {
            setInterviewLoading(true);

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

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to generate interview preparation."
                );
                return;
            }

            setInterview(data.interview);

            setTimeout(() => {
                document
                    .getElementById(
                        "interview-preparation"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            }, 100);

        } catch (error) {
            console.error(
                "Interview preparation error:",
                error
            );

            alert(
                "Unable to generate interview preparation."
            );
        } finally {
            setInterviewLoading(false);
        }
    };


    return (
        <>

            {/* =================================================
                CAREER ANALYSIS
            ================================================= */}

            <section className="analysis-results">

                <div className="analysis-header">

                    <div>
                        <span className="analysis-eyebrow">
                            ✦ AI Career Intelligence
                        </span>

                        <h2>
                            Career Analysis Results
                        </h2>

                        <p>
                            Personalized analysis for{" "}
                            <strong>
                                {analysis.targetRole}
                            </strong>
                        </p>
                    </div>

                    <div className="analysis-score-card">

                        <span>
                            Career Match
                        </span>

                        <strong>
                            {analysis.matchScore}%
                        </strong>

                    </div>

                </div>


                {/* AI SUMMARY */}

                <div className="analysis-summary">

                    <div className="analysis-summary-icon">
                        🤖
                    </div>

                    <div>
                        <h3>
                            AI Career Summary
                        </h3>

                        <p>
                            {analysis.analysisSummary}
                        </p>
                    </div>

                </div>


                {/* MATCHED SKILLS */}

                <div className="analysis-skills-section">

                    <div className="analysis-section-header">

                        <div>
                            <h3>
                                ✓ Matched Skills
                            </h3>

                            <p>
                                Skills from your resume
                                that match the job
                                requirements.
                            </p>
                        </div>

                        <span className="analysis-count-badge">
                            {
                                analysis.matchedSkills?.length ||
                                0
                            }
                        </span>

                    </div>


                    <div className="analysis-skill-list">

                        {analysis.matchedSkills?.map(
                            (skill, index) => (
                                <span
                                    className="matched-skill"
                                    key={`${skill}-${index}`}
                                >
                                    ✓ {skill}
                                </span>
                            )
                        )}

                    </div>

                </div>


                {/* SKILL GAPS */}

                <div className="analysis-skills-section">

                    <div className="analysis-section-header">

                        <div>
                            <h3>
                                ⚠️ Skill Gaps
                            </h3>

                            <p>
                                Skills you should
                                develop to improve
                                your career readiness.
                            </p>
                        </div>

                        <span className="analysis-count-badge gap-badge">
                            {
                                analysis.missingSkills?.length ||
                                0
                            }
                        </span>

                    </div>


                    <div className="analysis-skill-list">

                        {analysis.missingSkills?.length >
                        0 ? (

                            analysis.missingSkills.map(
                                (skill, index) => (
                                    <span
                                        className="missing-skill"
                                        key={`${skill}-${index}`}
                                    >
                                        ⚠ {skill}
                                    </span>
                                )
                            )

                        ) : (

                            <p className="no-gaps-message">
                                🎉 No major skill gaps
                                were identified.
                            </p>

                        )}

                    </div>

                </div>


                {/* ROADMAP CTA */}

                {analysis.missingSkills?.length > 0 && (

                    <div className="roadmap-cta">

                        <div className="roadmap-cta-icon">
                            📚
                        </div>

                        <div className="roadmap-cta-content">

                            <h3>
                                Build Your Learning Roadmap
                            </h3>

                            <p>
                                Get a personalized,
                                step-by-step plan to
                                improve the skills you
                                are missing.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={handleRoadmapClick}
                            disabled={roadmapLoading}
                        >
                            {roadmapLoading
                                ? "Generating..."
                                : roadmap
                                ? "View Learning Roadmap"
                                : "Generate Learning Roadmap"}
                        </button>

                    </div>

                )}


                {/* =================================================
                    LEARNING ROADMAP
                ================================================= */}

                {roadmap && (

                    <section
                        className="learning-roadmap"
                        id="learning-roadmap"
                    >

                        {/* ROADMAP HEADER */}

                        <div className="roadmap-header">

                            <div>
                                <span className="roadmap-eyebrow">
                                    ✦ Personalized Learning Plan
                                </span>

                                <h2>
                                    📚 AI Learning Roadmap
                                </h2>

                                <p>
                                    A complete step-by-step learning plan
                                    created specifically for your identified
                                    skill gaps.
                                </p>
                            </div>

                            <div className="roadmap-total-card">

                                <strong>
                                    {roadmap.roadmap?.length || 0}
                                </strong>

                                <span>
                                    {"Skill Gaps"}
                                </span>

                            </div>

                        </div>


                        {/* ROADMAP SKILLS */}

                        <div className="roadmap-skill-list">

                            {roadmap.roadmap?.map(
                                (skillPlan, skillIndex) => {

                                    const progress =
                                        calculateSkillProgress(
                                            skillPlan
                                        );

                                    const completedSteps =
                                        (
                                            skillPlan.steps || []
                                        ).filter(
                                            (step) =>
                                                step.completed
                                        ).length;

                                    const totalSteps =
                                        skillPlan.steps?.length || 0;

                                    return (

                                        <div
                                            className="roadmap-skill-card"
                                            key={`${skillPlan.skill}-${skillIndex}`}
                                        >

                                            {/* SKILL OVERVIEW */}

                                            <div className="roadmap-skill-header">

                                                <div>

                                                    <div className="roadmap-skill-title-row">

                                                        <h3>
                                                            🎯 {skillPlan.skill}
                                                        </h3>

                                                        <span
                                                            className={`roadmap-priority roadmap-priority-${String(
                                                                skillPlan.priority ||
                                                                    "Medium"
                                                            ).toLowerCase()}`}
                                                        >
                                                            {skillPlan.priority ||
                                                                "Medium"}{" "}
                                                            Priority
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* WHY THIS SKILL MATTERS */}

                                            {skillPlan.whyItMatters && (
                                                <div className="roadmap-info-box">

                                                    <h4>
                                                        💡 Why This Skill Matters
                                                    </h4>

                                                    <p>
                                                        {skillPlan.whyItMatters}
                                                    </p>

                                                </div>
                                            )}


                                            {/* BEGINNER EXPLANATION */}

                                            {skillPlan.beginnerExplanation && (

                                                <div className="roadmap-explanation">

                                                    <h4>
                                                        📖 Understand the Skill
                                                    </h4>

                                                    <p>
                                                        {
                                                            skillPlan.beginnerExplanation
                                                        }
                                                    </p>

                                                </div>

                                            )}


                                            {/* ESTIMATED LEARNING TIME */}

                                            {skillPlan.estimatedTime && (

                                                <div className="roadmap-time-box">

                                                    <span>
                                                        ⏱️ Estimated Learning Time
                                                    </span>

                                                    <strong>
                                                        {skillPlan.estimatedTime}
                                                    </strong>

                                                </div>

                                            )}


                                            {/* STEP-BY-STEP LEARNING PLAN */}

                                            <div className="roadmap-steps-section">

                                                <div className="roadmap-section-heading">
                                                    <h4>
                                                        📝 Step-by-Step Learning Plan
                                                    </h4>

                                                    <p>
                                                        Follow these steps in order. Each step explains
                                                        what you need to learn, how to learn it, and
                                                        what you should practice.
                                                    </p>
                                                </div>

                                                <div className="roadmap-steps">

                                                    {skillPlan.steps?.map(
                                                        (step, stepIndex) => {

                                                            const progressKey =
                                                                `${skillIndex}-${stepIndex}`;

                                                            return (
                                                                <div
                                                                    className={`roadmap-step ${
                                                                        step.completed
                                                                            ? "roadmap-step-completed"
                                                                            : ""
                                                                    }`}
                                                                    key={`${step.stepNumber}-${stepIndex}`}
                                                                >

                                                                    {/* STEP */}

                                                                    <div className="roadmap-step-info">

                                                                        <div className="roadmap-step-number-box">
                                                                            STEP{" "}
                                                                            {step.stepNumber ||
                                                                                stepIndex + 1}
                                                                        </div>

                                                                        <h5>
                                                                            {step.title ||
                                                                                `Learning Step ${
                                                                                    stepIndex + 1
                                                                                }`}
                                                                        </h5>

                                                                    </div>


                                                                    {/* WHAT TO LEARN */}

                                                                    {step.whatToLearn && (
                                                                        <div className="roadmap-step-box roadmap-what-box">

                                                                            <h5>
                                                                                📘 What to Learn
                                                                            </h5>

                                                                            <p>
                                                                                {step.whatToLearn}
                                                                            </p>

                                                                        </div>
                                                                    )}


                                                                    {/* HOW TO LEARN */}

                                                                    {step.howToLearn && (
                                                                        <div className="roadmap-step-box roadmap-how-box">

                                                                            <h5>
                                                                                🛠️ How to Learn
                                                                            </h5>

                                                                            <p>
                                                                                {step.howToLearn}
                                                                            </p>

                                                                        </div>
                                                                    )}


                                                                    {/* PRACTICE TASK */}

                                                                    {step.practiceTask && (
                                                                        <div className="roadmap-step-box roadmap-practice-box">

                                                                            <h5>
                                                                                💻 Practice Task
                                                                            </h5>

                                                                            <p>
                                                                                {step.practiceTask}
                                                                            </p>

                                                                        </div>
                                                                    )}

                                                                </div>
                                                            );
                                                        }
                                                    )}

                                                </div>

                                            </div>


                                            {/* PRACTICE EXERCISES */}

                                            {skillPlan.practiceExercises?.length >
                                                0 && (

                                                <div className="roadmap-exercises">

                                                    <h4>
                                                        🧩 Practice Exercises
                                                    </h4>

                                                    <p className="roadmap-section-description">
                                                        Use these exercises to
                                                        strengthen your understanding
                                                        before moving to a real project.
                                                    </p>

                                                    <ul>

                                                        {skillPlan.practiceExercises.map(
                                                            (
                                                                exercise,
                                                                index
                                                            ) => (

                                                                <li
                                                                    key={index}
                                                                >
                                                                    {exercise}
                                                                </li>

                                                            )
                                                        )}

                                                    </ul>

                                                </div>

                                            )}


                                            {/* PORTFOLIO PROJECT */}

                                            {skillPlan.project && (

                                                <div className="roadmap-project">

                                                    <h4>
                                                        🚀 Portfolio Project
                                                    </h4>

                                                    <p>
                                                        {
                                                            skillPlan.project
                                                        }
                                                    </p>


                                                    {skillPlan.projectSteps?.length >
                                                        0 && (

                                                        <ol>

                                                            {skillPlan.projectSteps.map(
                                                                (
                                                                    projectStep,
                                                                    index
                                                                ) => (

                                                                    <li
                                                                        key={index}
                                                                    >
                                                                        {
                                                                            projectStep
                                                                        }
                                                                    </li>

                                                                )
                                                            )}

                                                        </ol>

                                                    )}

                                                </div>

                                            )}


                                            {/* EXPECTED OUTCOME */}

                                            {skillPlan.expectedOutcome && (

                                                <div className="roadmap-outcome">

                                                    <h4>
                                                        🎯 Expected Outcome
                                                    </h4>

                                                    <p>
                                                        {
                                                            skillPlan.expectedOutcome
                                                        }
                                                    </p>

                                                </div>

                                            )}


                                            {/* COMPLETION TRACKING */}

                                            <div className="roadmap-progress-card">

                                                <div className="roadmap-progress-header">

                                                    <div>

                                                        <span className="roadmap-progress-eyebrow">
                                                            ✦ Learning Progress
                                                        </span>

                                                        <h4>
                                                            ☑️ Track Your Progress
                                                        </h4>

                                                        <p>
                                                            Complete each learning
                                                            step above. Your progress
                                                            is automatically saved.
                                                        </p>

                                                    </div>

                                                    <div
                                                        className={
                                                            progress === 100
                                                                ? "roadmap-progress-complete"
                                                                : "roadmap-progress-percentage"
                                                        }
                                                    >
                                                        {progress}%
                                                    </div>

                                                </div>


                                                <div className="roadmap-progress-container">

                                                    <div className="roadmap-progress-top">

                                                        <span>
                                                            Completion Progress
                                                        </span>

                                                        <strong>
                                                            {completedSteps}{" "}
                                                            of{" "}
                                                            {totalSteps}{" "}
                                                            steps completed
                                                        </strong>

                                                    </div>


                                                    <div className="roadmap-progress-bar">

                                                        <div
                                                            className="roadmap-progress-fill"
                                                            style={{
                                                                width: `${progress}%`
                                                            }}
                                                        ></div>

                                                    </div>

                                                </div>


                                                {/* CHECKBOX LIST */}

                                                <div className="roadmap-completion-section">

                                                    <h5>
                                                        ✅ Mark Learning Steps as Completed
                                                    </h5>

                                                    <p>
                                                        Tick a box when you have
                                                        completed that learning step.
                                                    </p>


                                                    <div className="roadmap-completion-list">

                                                        {skillPlan.steps?.map(
                                                            (
                                                                step,
                                                                stepIndex
                                                            ) => {

                                                                const progressKey =
                                                                    `${skillIndex}-${stepIndex}`;

                                                                return (

                                                                    <label
                                                                        className={`roadmap-completion-item ${
                                                                            step.completed
                                                                                ? "roadmap-step-completed"
                                                                                : ""
                                                                        }`}
                                                                        key={`${step.stepNumber}-completion-${stepIndex}`}
                                                                    >

                                                                        <input
                                                                            type="checkbox"
                                                                            checked={Boolean(
                                                                                step.completed
                                                                            )}
                                                                            disabled={
                                                                                progressUpdating ===
                                                                                progressKey
                                                                            }
                                                                            onChange={() =>
                                                                                handleStepToggle(
                                                                                    skillIndex,
                                                                                    stepIndex
                                                                                )
                                                                            }
                                                                        />

                                                                        <span className="roadmap-custom-checkbox">
                                                                            {step.completed
                                                                                ? "✓"
                                                                                : ""}
                                                                        </span>

                                                                        <span className="roadmap-completion-text">

                                                                            <strong>
                                                                                Step{" "}
                                                                                {
                                                                                    step.stepNumber ||
                                                                                    stepIndex +
                                                                                        1
                                                                                }
                                                                            </strong>

                                                                            {" — "}

                                                                            {
                                                                                step.title ||
                                                                                `Learning Step ${
                                                                                    stepIndex +
                                                                                    1
                                                                                }`
                                                                            }

                                                                        </span>

                                                                    </label>

                                                                );

                                                            }
                                                        )}

                                                    </div>

                                                </div>


                                                {progress === 100 && (

                                                    <div className="roadmap-completed-message">

                                                        🎉 Skill completed!

                                                        <p>
                                                            Excellent work! You have
                                                            completed all the learning
                                                            steps for{" "}
                                                            <strong>
                                                                {skillPlan.skill}
                                                            </strong>.
                                                        </p>

                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    </section>

                )}


                {/* =================================================
                    INTERVIEW PREPARATION CTA
                ================================================= */}

                <div className="interview-prep-cta">

                    <div className="interview-prep-icon">
                        🎤
                    </div>

                    <div>

                        <h3>
                            Prepare for Your Interview
                        </h3>

                        <p>
                            Get personalized technical,
                            scenario, and behavioral
                            interview questions based
                            on this analysis.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handleInterviewClick}
                        disabled={interviewLoading}
                    >
                        {interviewLoading
                            ? "Preparing..."
                            : interview
                            ? "View Interview Prep"
                            : "Start Interview Prep"}
                    </button>

                </div>


                {/* =================================================
                    INTERVIEW PREPARATION
                ================================================= */}

                {interview && (

                    <section
                        className="interview-preparation"
                        id="interview-preparation"
                    >

                        <div className="interview-header">

                            <div>

                                <span className="interview-eyebrow">
                                    ✦ AI Interview Coach
                                </span>

                                <h2>
                                    🎤 Interview Preparation
                                </h2>

                                <p>
                                    Personalized questions
                                    based on your target
                                    role, skills, and
                                    identified skill gaps.
                                </p>

                            </div>

                            <div className="interview-count-card">

                                <strong>
                                    {
                                        (interview.technicalQuestions?.length ||
                                            0) +
                                        (interview.scenarioQuestions?.length ||
                                            0) +
                                        (interview.behavioralQuestions?.length ||
                                            0)
                                    }
                                </strong>

                                <span>
                                    Questions
                                </span>

                            </div>

                        </div>


                        {/* TECHNICAL QUESTIONS */}

                        {interview.technicalQuestions?.length >
                            0 && (

                            <div className="interview-section">

                                <div className="interview-section-header">

                                    <div className="interview-section-icon">
                                        💻
                                    </div>

                                    <div>
                                        <h3>
                                            Technical Questions
                                        </h3>

                                        <p>
                                            Questions focused
                                            on the technologies
                                            and concepts
                                            required for the
                                            role.
                                        </p>
                                    </div>

                                    <span className="interview-section-count">
                                        {
                                            interview
                                                .technicalQuestions
                                                .length
                                        }
                                    </span>

                                </div>


                                <div className="interview-question-list">

                                    {interview.technicalQuestions.map(
                                        (
                                            question,
                                            index
                                        ) => (

                                            <div
                                                className="interview-question-card"
                                                key={index}
                                            >

                                                <div className="interview-question-top">

                                                    <span className="interview-question-number">
                                                        Q{index + 1}
                                                    </span>

                                                    <span className="interview-topic">
                                                        {
                                                            question.topic
                                                        }
                                                    </span>

                                                    <span className="interview-difficulty">
                                                        {
                                                            question.difficulty
                                                        }
                                                    </span>

                                                </div>

                                                <h4>
                                                    {
                                                        question.question
                                                    }
                                                </h4>

                                                <div className="interview-answer">

                                                    <strong>
                                                        💡 Model Answer
                                                    </strong>

                                                    <p>
                                                        {
                                                            question.answer
                                                        }
                                                    </p>

                                                </div>

                                                <div className="interview-tip">

                                                    <strong>
                                                        🎯 Interview Tip
                                                    </strong>

                                                    <p>
                                                        {
                                                            question.tip
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}


                        {/* SCENARIO QUESTIONS */}

                        {interview.scenarioQuestions?.length >
                            0 && (

                            <div className="interview-section scenario-section">

                                <div className="interview-section-header">

                                    <div className="interview-section-icon">
                                        🧩
                                    </div>

                                    <div>
                                        <h3>
                                            Scenario Questions
                                        </h3>

                                        <p>
                                            Practice solving
                                            realistic software
                                            development
                                            situations.
                                        </p>
                                    </div>

                                    <span className="interview-section-count">
                                        {
                                            interview
                                                .scenarioQuestions
                                                .length
                                        }
                                    </span>

                                </div>


                                <div className="interview-question-list">

                                    {interview.scenarioQuestions.map(
                                        (
                                            question,
                                            index
                                        ) => (

                                            <div
                                                className="interview-question-card scenario-question-card"
                                                key={index}
                                            >

                                                <div className="interview-question-top">

                                                    <span className="interview-question-number">
                                                        Q{index + 1}
                                                    </span>

                                                    <span className="interview-topic">
                                                        Scenario
                                                    </span>

                                                </div>

                                                <h4>
                                                    {
                                                        question.question
                                                    }
                                                </h4>

                                                <div className="interview-answer">

                                                    <strong>
                                                        💡 Model Approach
                                                    </strong>

                                                    <p>
                                                        {
                                                            question.answer
                                                        }
                                                    </p>

                                                </div>

                                                <div className="interview-tip">

                                                    <strong>
                                                        🎯 Interview Tip
                                                    </strong>

                                                    <p>
                                                        {
                                                            question.tip
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}


                        {/* BEHAVIORAL QUESTIONS */}

                        {interview.behavioralQuestions?.length >
                            0 && (

                            <div className="interview-section behavioral-section">

                                <div className="interview-section-header">

                                    <div className="interview-section-icon">
                                        🗣️
                                    </div>

                                    <div>
                                        <h3>
                                            Behavioral Questions
                                        </h3>

                                        <p>
                                            Prepare professional
                                            answers for common
                                            entry-level
                                            interview questions.
                                        </p>
                                    </div>

                                    <span className="interview-section-count">
                                        {
                                            interview
                                                .behavioralQuestions
                                                .length
                                        }
                                    </span>

                                </div>


                                <div className="interview-question-list">

                                    {interview.behavioralQuestions.map(
                                        (
                                            question,
                                            index
                                        ) => (

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
                                                    {
                                                        question.question
                                                    }
                                                </h4>

                                                <div className="interview-answer">

                                                    <strong>
                                                        💡 Example Answer
                                                    </strong>

                                                    <p>
                                                        {
                                                            question.answer
                                                        }
                                                    </p>

                                                </div>

                                                <div className="interview-tip">

                                                    <strong>
                                                        🎯 Interview Tip
                                                    </strong>

                                                    <p>
                                                        {
                                                            question.tip
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}


                        {/* PREPARATION TIPS */}

                        {interview.preparationTips?.length >
                            0 && (

                            <div className="interview-tips-section">

                                <div className="interview-section-header">

                                    <div className="interview-section-icon">
                                        ⭐
                                    </div>

                                    <div>
                                        <h3>
                                            Interview Preparation Tips
                                        </h3>

                                        <p>
                                            Practical advice
                                            to help you perform
                                            confidently.
                                        </p>
                                    </div>

                                </div>


                                <div className="interview-tips-grid">

                                    {interview.preparationTips.map(
                                        (
                                            tip,
                                            index
                                        ) => (

                                            <div
                                                className="interview-tip-card"
                                                key={index}
                                            >

                                                <span className="interview-tip-number">
                                                    {index + 1}
                                                </span>

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
        </>
    );
}

export default AnalysisResults;

