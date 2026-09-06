import { useEffect, useState } from "react";
import "./App.css";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import QuickActions from "./components/QuickActions";
import SkillGap from "./components/SkillGap";
import ResumeForm from "./components/ResumeForm";
import JobDescriptionForm from "./components/JobDescriptionForm";
import ResumeList from "./components/ResumeList";

function App() {
    const [targetRole, setTargetRole] = useState(
        "Full Stack Developer"
    );

    const [resumeTitle, setResumeTitle] = useState("");
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");

    // All saved resumes
    const [resumes, setResumes] = useState([]);

    // Currently selected resume
    const [selectedResumeId, setSelectedResumeId] =
        useState(null);

    // True when creating a new resume
    const [isCreatingNewResume, setIsCreatingNewResume] =
        useState(false);

    // Login state
    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("careerAI_token"))
    );

    // Authentication screen state
    const [showRegister, setShowRegister] = useState(false);

    // Registration success message
    const [registrationSuccess, setRegistrationSuccess] =
        useState(false);

    /*
     * LOAD USER RESUMES
     */
    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        const loadSavedResumes = async () => {
            try {
                const token =
                    localStorage.getItem("careerAI_token");

                if (!token) {
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/resumes",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.error(
                        "Failed to load resumes:",
                        data.message
                    );
                    return;
                }

                const savedResumes =
                    data.resumes || [];

                setResumes(savedResumes);

                /*
                 * Select the most recently updated resume
                 */
                if (savedResumes.length > 0) {
                    setSelectedResumeId(
                        savedResumes[0]._id
                    );

                    setResumeTitle(
                        savedResumes[0].title || ""
                    );

                    setResumeText(
                        savedResumes[0].resumeText
                    );

                    setIsCreatingNewResume(false);
                } else {
                    setSelectedResumeId(null);
                    setResumeTitle("");
                    setResumeText("");
                    setIsCreatingNewResume(true);
                }
            } catch (error) {
                console.error(
                    "Unable to load saved resumes:",
                    error
                );
            }
        };

        loadSavedResumes();
    }, [isLoggedIn]);

    /*
     * LOGIN
     */
    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowRegister(false);
        setRegistrationSuccess(false);
    };

    /*
     * LOGOUT
     */
    const handleLogout = () => {
        localStorage.removeItem("careerAI_token");
        localStorage.removeItem("careerAI_user");

        setIsLoggedIn(false);
        setShowRegister(false);
        setRegistrationSuccess(false);

        setResumes([]);
        setSelectedResumeId(null);
        setResumeTitle("");
        setResumeText("");
    };

    /*
     * REGISTRATION SUCCESS
     */
    const handleRegisterSuccess = () => {
        setShowRegister(false);
        setRegistrationSuccess(true);
    };

    /*
     * QUICK ACTIONS
     */
    const handleAction = (action) => {
        if (action === "resume") {
            document
                .getElementById("resume-analysis")
                ?.scrollIntoView({
                    behavior: "smooth"
                });
        }

        if (action === "skills") {
            document
                .getElementById("skill-gaps")
                ?.scrollIntoView({
                    behavior: "smooth"
                });
        }

        if (action === "roadmap") {
            alert(
                "Learning Roadmap will be connected to AI soon."
            );
        }

        if (action === "interview") {
            alert(
                "Interview Preparation will be connected to AI soon."
            );
        }
    };

    /*
     * ADD NEW RESUME
     */
    const handleAddResume = () => {
        setSelectedResumeId(null);
        setResumeTitle("");
        setResumeText("");
        setIsCreatingNewResume(true);

        document
            .getElementById("resume-analysis")
            ?.scrollIntoView({
                behavior: "smooth"
            });
    };

    /*
     * SELECT EXISTING RESUME
     */
    const handleSelectResume = (resume) => {
        setSelectedResumeId(resume._id);
        setResumeTitle(resume.title || "");
        setResumeText(resume.resumeText);
        setIsCreatingNewResume(false);

        document
            .getElementById("resume-analysis")
            ?.scrollIntoView({
                behavior: "smooth"
            });
    };

    /*
     * DELETE RESUME
     */
    const handleDeleteResume = async (resumeId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this resume?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const token =
                localStorage.getItem("careerAI_token");

            if (!token) {
                alert("Please log in again.");
                return;
            }

            const response = await fetch(
                `http://localhost:5000/api/resumes/${resumeId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                        "Failed to delete resume."
                );
                return;
            }

            const remainingResumes =
                resumes.filter(
                    (resume) =>
                        resume._id !== resumeId
                );

            setResumes(remainingResumes);

            /*
             * If deleted resume was active
             */
            if (selectedResumeId === resumeId) {
                if (remainingResumes.length > 0) {
                    setSelectedResumeId(
                        remainingResumes[0]._id
                    );

                    setResumeTitle(
                        remainingResumes[0].title || ""
                    );

                    setResumeText(
                        remainingResumes[0].resumeText
                    );

                    setIsCreatingNewResume(false);
                } else {
                    setSelectedResumeId(null);
                    setResumeTitle("");
                    setResumeText("");
                    setIsCreatingNewResume(true);
                }
            }
        } catch (error) {
            console.error(
                "Resume delete error:",
                error
            );

            alert(
                "Unable to connect to the CareerAI server."
            );
        }
    };

    /*
     * SAVE OR UPDATE RESUME
     */
    const handleSaveResume = async () => {
        try {
            const token =
                localStorage.getItem("careerAI_token");

            if (!token) {
                alert("Please log in again.");
                return;
            }

            if (!resumeTitle.trim()) {
                alert(
                    "Please enter a title for your resume."
                );
                return;
            }

            if (!resumeText.trim()) {
                alert(
                    "Please enter your resume before saving."
                );
                return;
            }

            let response;

            /*
             * CREATE NEW RESUME
             */
            if (
                isCreatingNewResume ||
                !selectedResumeId
            ) {
                response = await fetch(
                    "http://localhost:5000/api/resumes",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            title: resumeTitle.trim(),
                            resumeText:
                                resumeText.trim()
                        })
                    }
                );
            }

            /*
             * UPDATE EXISTING RESUME
             */
            else {
                response = await fetch(
                    `http://localhost:5000/api/resumes/${selectedResumeId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            title: resumeTitle.trim(),
                            resumeText:
                                resumeText.trim()
                        })
                    }
                );
            }

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                        "Failed to save resume."
                );
                return;
            }

            const savedResume = data.resume;

            /*
             * CREATE NEW RESUME IN LIST
             */
            if (
                isCreatingNewResume ||
                !selectedResumeId
            ) {
                setResumes((currentResumes) => [
                    savedResume,
                    ...currentResumes
                ]);
            }

            /*
             * UPDATE EXISTING RESUME IN LIST
             */
            else {
                setResumes((currentResumes) =>
                    currentResumes.map(
                        (resume) =>
                            resume._id ===
                            selectedResumeId
                                ? savedResume
                                : resume
                    )
                );
            }

            setSelectedResumeId(
                savedResume._id
            );

            setResumeTitle(
                savedResume.title || ""
            );

            setResumeText(
                savedResume.resumeText
            );

            setIsCreatingNewResume(false);

            alert(
                isCreatingNewResume ||
                    !selectedResumeId
                    ? "New resume saved successfully!"
                    : "Resume updated successfully!"
            );
        } catch (error) {
            console.error(
                "Resume save error:",
                error
            );

            alert(
                "Unable to connect to the CareerAI server."
            );
        }
    };

    /*
     * AUTHENTICATION SCREENS
     */
    if (!isLoggedIn) {
        if (showRegister) {
            return (
                <Register
                    onRegisterSuccess={
                        handleRegisterSuccess
                    }

                    onGoToLogin={() => {
                        setShowRegister(false);
                    }}
                />
            );
        }

        return (
            <Login
                onLogin={handleLogin}

                registrationSuccess={
                    registrationSuccess
                }

                onLoginPage={() => {
                    setRegistrationSuccess(false);
                }}

                onGoToRegister={() => {
                    setRegistrationSuccess(false);
                    setShowRegister(true);
                }}
            />
        );
    }

    /*
     * MAIN DASHBOARD
     */
    return (
        <div className="app">

            {/* Sidebar */}
            <Sidebar
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <main className="main-content">

                {/* Header */}
                <Header />

                {/* Target Career */}
                <div className="target-career">

                    <div>
                        <p className="section-label">
                            YOUR TARGET CAREER
                        </p>

                        <h2>
                            🎯 {targetRole}
                        </h2>

                        <p>
                            CareerAI is analyzing your
                            skills against your target role.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            const newRole =
                                prompt(
                                    "Enter your target career role:"
                                );

                            if (
                                newRole &&
                                newRole.trim() !== ""
                            ) {
                                setTargetRole(
                                    newRole.trim()
                                );
                            }
                        }}
                    >
                        ✏️ Change Target Role
                    </button>

                </div>

                {/* Statistics */}
                <div className="stats-grid">

                    <StatCard
                        title="Career Readiness"
                        value="78%"
                        description="Good progress"
                        icon="📈"
                    />

                    <StatCard
                        title="Skills Matched"
                        value="12"
                        description="Skills match your target role"
                        icon="✓"
                    />

                    <StatCard
                        title="Skill Gaps"
                        value="5"
                        description="Skills need improvement"
                        icon="⚠️"
                    />

                    <StatCard
                        title="Learning Progress"
                        value="64%"
                        description="Roadmap completed"
                        icon="📚"
                    />

                </div>

                {/* Dashboard Grid */}
                <div className="dashboard-grid">

                    {/* Career Readiness */}
                    <div className="dashboard-card">

                        <div className="card-header">

                            <div>
                                <h3>
                                    Career Readiness
                                </h3>

                                <p>
                                    Your overall readiness
                                    for the target role.
                                </p>
                            </div>

                            <strong>
                                78%
                            </strong>

                        </div>

                        <div className="progress">

                            <div
                                className="progress-bar"
                                style={{
                                    width: "78%"
                                }}
                            ></div>

                        </div>

                        <div className="progress-labels">
                            <span>Beginner</span>
                            <span>Job Ready</span>
                        </div>

                    </div>

                    {/* Quick Actions */}
                    <div className="dashboard-card">

                        <QuickActions
                            onAction={handleAction}
                        />

                    </div>

                </div>

                {/* My Resumes */}
                <div className="dashboard-card">

                    <ResumeList
                        resumes={resumes}

                        selectedResumeId={
                            selectedResumeId
                        }

                        onSelectResume={
                            handleSelectResume
                        }

                        onDeleteResume={
                            handleDeleteResume
                        }

                        onAddResume={
                            handleAddResume
                        }
                    />

                </div>

                {/* Resume Analysis / Editor */}
                <div
                    className="dashboard-card"
                    id="resume-analysis"
                >

                    <ResumeForm
                        resumeTitle={resumeTitle}
                        setResumeTitle={
                            setResumeTitle
                        }

                        resumeText={resumeText}
                        setResumeText={
                            setResumeText
                        }

                        onAnalyze={
                            handleSaveResume
                        }
                    />

                </div>

                {/* Job Description Analysis */}
                <div className="dashboard-card">

                    <JobDescriptionForm
                        jobDescription={
                            jobDescription
                        }

                        setJobDescription={
                            setJobDescription
                        }

                        targetRole={
                            targetRole
                        }

                        setTargetRole={
                            setTargetRole
                        }

                        onAnalyze={() => {
                            alert(
                                `Job description received! ${jobDescription.length} characters ready for AI analysis.`
                            );
                        }}
                    />

                </div>

                {/* Skill Gaps */}
                <div
                    className="dashboard-card skill-section"
                    id="skill-gaps"
                >

                    <div className="card-header">

                        <div>
                            <h3>
                                🎯 Your Top Skill Gaps
                            </h3>

                            <p>
                                Focus on these skills to
                                improve your career readiness.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                document
                                    .getElementById(
                                        "skill-gaps"
                                    )
                                    ?.scrollIntoView({
                                        behavior:
                                            "smooth"
                                    });
                            }}
                        >
                            View All
                        </button>

                    </div>

                    <div className="skill-grid">

                        <SkillGap
                            skill="MongoDB"
                            priority="High"
                            progress={30}
                        />

                        <SkillGap
                            skill="Docker"
                            priority="Medium"
                            progress={45}
                        />

                        <SkillGap
                            skill="REST APIs"
                            priority="Medium"
                            progress={55}
                        />

                    </div>

                </div>

                {/* Footer */}
                <footer>
                    © 2026 CareerAI — AI-Powered Career
                    Readiness Platform
                </footer>

            </main>

        </div>
    );
}

export default App;