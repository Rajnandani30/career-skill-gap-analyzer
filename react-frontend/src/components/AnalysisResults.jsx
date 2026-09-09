
import { useState } from "react";

function AnalysisResults({ analysis }) {
    const [roadmap, setRoadmap] = useState(null);
    const [roadmapLoading, setRoadmapLoading] = useState(false);

    if (!analysis) {
        return null;
    }

    const {
        matchScore = 0,
        matchedSkills = [],
        missingSkills = [],
        analysisSummary = ""
    } = analysis;

    const handleRoadmapClick = async () => {
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

            setRoadmap(data.roadmap);

            console.log(
                "AI Learning Roadmap:",
                data.roadmap
            );

        } catch (error) {
            console.error(
                "Learning roadmap error:",
                error
            );

            alert(
                "Unable to connect to the CareerAI server."
            );
        } finally {
            setRoadmapLoading(false);
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
                AI CAREER SUMMARY
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

                {/* Matched Skills */}

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


                {/* Skill Gaps */}

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
                ROADMAP BUTTON
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
                PERSONALIZED LEARNING ROADMAP
               ================================================= */}

            {roadmap &&
                roadmap.roadmap &&
                roadmap.roadmap.length > 0 && (

                <div className="learning-roadmap">

                    {/* Roadmap Header */}

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


                    {/* =================================================
                        ROADMAP SKILL SECTIONS
                       ================================================= */}

                    <div className="roadmap-list">

                        {roadmap.roadmap.map(
                            (item, index) => (

                            <div
                                className="roadmap-item"
                                key={`${item.skill}-${index}`}
                            >

                                {/* Number */}

                                <div className="roadmap-number">
                                    {index + 1}
                                </div>


                                <div className="roadmap-content">

                                    {/* Skill Header */}

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


                                    {/* =================================================
                                        BEGINNER EXPLANATION
                                       ================================================= */}

                                    {item.beginnerExplanation && (

                                        <div className="roadmap-beginner-box">

                                            <h4>
                                                👋 What is{" "}
                                                {item.skill}?
                                            </h4>

                                            <p>
                                                {
                                                    item.beginnerExplanation
                                                }
                                            </p>

                                        </div>

                                    )}


                                    {/* =================================================
                                        WHY IT MATTERS
                                       ================================================= */}

                                    {item.whyItMatters && (

                                        <div className="roadmap-why-box">

                                            <h4>
                                                🎯 Why this skill matters
                                            </h4>

                                            <p>
                                                {
                                                    item.whyItMatters
                                                }
                                            </p>

                                        </div>

                                    )}


                                    {/* =================================================
                                        STEP-BY-STEP LEARNING PLAN
                                       ================================================= */}

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
                                                                {
                                                                    step.title
                                                                }
                                                            </h4>


                                                            {step.whatToLearn && (

                                                                <div className="roadmap-detail-block">

                                                                    <strong>
                                                                        📘 What to learn
                                                                    </strong>

                                                                    <p>
                                                                        {
                                                                            step.whatToLearn
                                                                        }
                                                                    </p>

                                                                </div>

                                                            )}


                                                            {step.howToLearn && (

                                                                <div className="roadmap-detail-block">

                                                                    <strong>
                                                                        🧭 How to learn
                                                                    </strong>

                                                                    <p>
                                                                        {
                                                                            step.howToLearn
                                                                        }
                                                                    </p>

                                                                </div>

                                                            )}


                                                            {step.practiceTask && (

                                                                <div className="roadmap-practice-task">

                                                                    <strong>
                                                                        🧪 Practice Task
                                                                    </strong>

                                                                    <p>
                                                                        {
                                                                            step.practiceTask
                                                                        }
                                                                    </p>

                                                                </div>

                                                            )}

                                                        </div>

                                                    </div>

                                                ))}

                                            </div>

                                        </div>

                                    )}


                                    {/* =================================================
                                        PRACTICE EXERCISES
                                       ================================================= */}

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

                                                ))}

                                            </ol>

                                        </div>

                                    )}


                                    {/* =================================================
                                        PORTFOLIO PROJECT
                                       ================================================= */}

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


                                    {/* =================================================
                                        PROJECT STEPS
                                       ================================================= */}

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
                                                            {
                                                                projectStep
                                                            }
                                                        </span>

                                                    </li>

                                                ))}

                                            </ol>

                                        </div>

                                    )}


                                    {/* =================================================
                                        EXPECTED OUTCOME
                                       ================================================= */}

                                    {item.expectedOutcome && (

                                        <div className="roadmap-outcome">

                                            <strong>
                                                🎓 Expected Outcome
                                            </strong>

                                            <p>
                                                {
                                                    item.expectedOutcome
                                                }
                                            </p>

                                        </div>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </section>
    );
}

export default AnalysisResults;