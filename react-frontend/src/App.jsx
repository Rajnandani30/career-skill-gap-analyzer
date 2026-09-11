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
import AnalysisResults from "./components/AnalysisResults";
import AnalysisHistory from "./components/AnalysisHistory";
import Profile from "./components/Profile";
import Settings from "./components/Settings";

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

    // Latest AI analysis
    const [latestAnalysis, setLatestAnalysis] =
        useState(null);

    // Learning roadmap progress
    const [roadmapProgress, setRoadmapProgress] = useState({});
    const [overallRoadmapProgress, setOverallRoadmapProgress] =
        useState(0);

    // Active application page
    const [activePage, setActivePage] =
        useState("dashboard");

    // All saved AI analyses
    const [analyses, setAnalyses] = useState([]);

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
     * =========================================================
     * LOAD USER DATA
     * =========================================================
     *
     * Loads:
     * 1. Saved resumes
     * 2. All saved analyses
     * 3. Latest analysis
     */

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        const loadUserData = async () => {
            try {
                const token =
                    localStorage.getItem("careerAI_token");

                if (!token) {
                    return;
                }

                /*
                 * =================================================
                 * LOAD SAVED RESUMES
                 * =================================================
                 */

                const resumeResponse = await fetch(
                    "http://localhost:5000/api/resumes",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const resumeData =
                    await resumeResponse.json();

                if (!resumeResponse.ok) {
                    console.error(
                        "Failed to load resumes:",
                        resumeData.message
                    );
                } else {
                    const savedResumes =
                        resumeData.resumes || [];

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
                            savedResumes[0].resumeText || ""
                        );

                        setIsCreatingNewResume(false);
                    } else {
                        setSelectedResumeId(null);
                        setResumeTitle("");
                        setResumeText("");
                        setIsCreatingNewResume(true);
                    }
                }

                /*
                 * =================================================
                 * LOAD SAVED ANALYSES
                 * =================================================
                 */

                const analysisResponse = await fetch(
                    "http://localhost:5000/api/analysis",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const analysisData =
                    await analysisResponse.json();

                if (!analysisResponse.ok) {
                    console.error(
                        "Failed to load analyses:",
                        analysisData.message
                    );

                    return;
                }

                const savedAnalyses =
                    analysisData.analyses || [];

                /*
                 * Store ALL analyses for History
                 */

                setAnalyses(savedAnalyses);

                /*
                 * Restore the latest analysis if one exists.
                 * Otherwise, reset all analysis-related dashboard data.
                 */

                if (savedAnalyses.length > 0) {
                    const latest = savedAnalyses[0];

                    setLatestAnalysis(latest);

                    setTargetRole(
                        latest.targetRole ||
                            "Full Stack Developer"
                    );

                    setJobDescription(
                        latest.jobDescription || ""
                    );
                } else {
                    setLatestAnalysis(null);
                    setRoadmapProgress({});
                    setOverallRoadmapProgress(0);
                    setJobDescription("");
                    setTargetRole("Full Stack Developer");
                }
            } catch (error) {
                console.error(
                    "Unable to load CareerAI data:",
                    error
                );
            }
        };

        loadUserData();
    }, [isLoggedIn]);

    /*
     * =========================================================
     * LOGIN
     * =========================================================
     */

    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowRegister(false);
        setRegistrationSuccess(false);
    };

    /*
     * =========================================================
     * LOGOUT
     * =========================================================
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
        setJobDescription("");
        setLatestAnalysis(null);
        setAnalyses([]);
        setRoadmapProgress({});
        setOverallRoadmapProgress(0);
        setTargetRole("Full Stack Developer");
        setActivePage("dashboard");
    };

    /*
     * =========================================================
     * PROFILE / SETTINGS NAVIGATION
     * =========================================================
     */

    const handleProfile = () => {
        setActivePage("profile");
    };

    const handleSettings = () => {
        setActivePage("settings");
    };

    const handleDashboard = () => {
        setActivePage("dashboard");
    };

    /*
     * =========================================================
     * REGISTRATION SUCCESS
     * =========================================================
     */

    const handleRegisterSuccess = () => {
        setShowRegister(false);
        setRegistrationSuccess(true);
    };

    /*
     * =========================================================
     * QUICK ACTIONS
     * =========================================================
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
            document
                .getElementById("learning-roadmap")
                ?.scrollIntoView({
                    behavior: "smooth"
                });
        }

        if (action === "interview") {
            document
                .getElementById("interview-preparation")
                ?.scrollIntoView({
                    behavior: "smooth"
                });
        }
    };

    /*
     * =========================================================
     * ADD NEW RESUME
     * =========================================================
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
     * =========================================================
     * SELECT EXISTING RESUME
     * =========================================================
     */

    const handleSelectResume = (resume) => {
        setSelectedResumeId(resume._id);
        setResumeTitle(resume.title || "");
        setResumeText(resume.resumeText || "");
        setIsCreatingNewResume(false);

        document
            .getElementById("resume-analysis")
            ?.scrollIntoView({
                behavior: "smooth"
            });
    };

    /*
     * =========================================================
     * DELETE RESUME
     * =========================================================
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
                        remainingResumes[0].resumeText || ""
                    );

                    setIsCreatingNewResume(false);
                } else {
                    setSelectedResumeId(null);
                    setResumeTitle("");
                    setResumeText("");
                    setIsCreatingNewResume(true);
                }
            }

            alert("Resume deleted successfully!");
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
     * =========================================================
     * SAVE OR UPDATE RESUME
     * =========================================================
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
                savedResume.resumeText || ""
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
     * =========================================================
     * ANALYZE JOB DESCRIPTION
     * =========================================================
     */

    const handleAnalyzeJob = async () => {
        try {
            const token =
                localStorage.getItem("careerAI_token");

            if (!token) {
                alert("Please log in again.");
                return;
            }

            if (!selectedResumeId) {
                alert(
                    "Please select a resume before analyzing the job."
                );

                return;
            }

            if (!targetRole.trim()) {
                alert(
                    "Please enter a target job role."
                );

                return;
            }

            if (!jobDescription.trim()) {
                alert(
                    "Please enter a job description."
                );

                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/analysis",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        resumeId:
                            selectedResumeId,

                        targetRole:
                            targetRole.trim(),

                        jobDescription:
                            jobDescription.trim()
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                        "Failed to analyze job."
                );

                return;
            }

            /*
             * Store returned analysis
             */

            setLatestAnalysis(
                data.analysis
            );

            /*
             * Add/update analysis in history
             */

            setAnalyses((currentAnalyses) => {
                const returnedAnalysis =
                    data.analysis;

                if (!returnedAnalysis) {
                    return currentAnalyses;
                }

                const alreadyExists =
                    currentAnalyses.some(
                        (item) =>
                            item._id ===
                            returnedAnalysis._id
                    );

                if (alreadyExists) {
                    return currentAnalyses.map(
                        (item) =>
                            item._id ===
                            returnedAnalysis._id
                                ? returnedAnalysis
                                : item
                    );
                }

                return [
                    returnedAnalysis,
                    ...currentAnalyses
                ];
            });

            /*
             * Keep returned values in the form
             */

            setTargetRole(
                data.analysis?.targetRole ||
                    targetRole
            );

            setJobDescription(
                data.analysis?.jobDescription ||
                    jobDescription
            );

            console.log(
                "AI Analysis:",
                data.analysis
            );

            if (
                data.message ===
                "This analysis already exists."
            ) {
                alert(
                    "This analysis already exists. The saved analysis has been loaded."
                );
            } else {
                alert(
                    "AI analysis completed and saved successfully!"
                );
            }

            /*
             * Automatically move user
             * to AI results
             */

            setTimeout(() => {
                document
                    .getElementById(
                        "analysis-results"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
            }, 200);
        } catch (error) {
            console.error(
                "Job analysis error:",
                error
            );

            alert(
                "Unable to connect to the CareerAI server."
            );
        }
    };

    /*
     * =========================================================
     * VIEW PREVIOUS ANALYSIS
     * =========================================================
     */

    const handleViewAnalysis = (analysis) => {
        if (!analysis) {
            return;
        }

        /*
         * Restore selected analysis
         */

        setLatestAnalysis(analysis);

        /*
         * Restore target role
         */

        setTargetRole(
            analysis.targetRole ||
                "Full Stack Developer"
        );

        /*
         * Restore job description
         */

        setJobDescription(
            analysis.jobDescription || ""
        );

        /*
         * Restore resume information
         */

        if (analysis.resumeId) {
            const resumeId =
                typeof analysis.resumeId ===
                "object"
                    ? analysis.resumeId._id
                    : analysis.resumeId;

            const matchingResume =
                resumes.find(
                    (resume) =>
                        resume._id ===
                        resumeId
                );

            if (matchingResume) {
                setSelectedResumeId(
                    matchingResume._id
                );

                setResumeTitle(
                    matchingResume.title || ""
                );

                setResumeText(
                    matchingResume.resumeText || ""
                );

                setIsCreatingNewResume(false);
            }
        }

        /*
         * Move back to analysis results
         */

        setTimeout(() => {
            document
                .getElementById(
                    "analysis-results"
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        }, 100);
    };

    /*
     * =========================================================
     * DELETE ANALYSIS
     * =========================================================
     */

    const handleDeleteAnalysis = async (
        analysisId
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this analysis?"
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
                `http://localhost:5000/api/analysis/${analysisId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                        "Failed to delete analysis."
                );

                return;
            }

            /*
             * Remove analysis from history.
             * Also reset or update the dashboard analysis.
             */

            setAnalyses((currentAnalyses) => {
                const remainingAnalyses =
                    currentAnalyses.filter(
                        (analysis) =>
                            analysis._id !==
                            analysisId
                    );

                /*
                 * If no analyses remain,
                 * reset dashboard values to zero.
                 */

                if (remainingAnalyses.length === 0) {
                    setLatestAnalysis(null);
                    setRoadmapProgress({});
                    setOverallRoadmapProgress(0);
                    setJobDescription("");
                    setTargetRole("Full Stack Developer");
                }

                /*
                 * If the deleted analysis was the
                 * currently displayed analysis,
                 * show the newest remaining analysis.
                 */

                else if (
                    latestAnalysis?._id ===
                    analysisId
                ) {
                    setLatestAnalysis(
                        remainingAnalyses[0]
                    );
                }

                return remainingAnalyses;
            });

            alert(
                "Analysis deleted successfully!"
            );
        } catch (error) {
            console.error(
                "Analysis delete error:",
                error
            );

            alert(
                "Unable to connect to the CareerAI server."
            );
        }
    };

    /*
     * =========================================================
     * AUTHENTICATION SCREENS
     * =========================================================
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
                onGoToRegister={() => {
                    setRegistrationSuccess(false);
                    setShowRegister(true);
                }}
            />
        );
    }

    /*
     * =========================================================
     * PROFILE PAGE
     * =========================================================
     */

    if (activePage === "profile") {
        return (
            <div className="app">
                <Sidebar
                    onLogout={handleLogout}
                    onProfile={handleProfile}
                    onSettings={handleSettings}
                />

                <main className="main-content">
                    <Profile
                        targetRole={targetRole}
                        resumes={resumes}
                        analyses={analyses}
                        roadmapProgress={
                            overallRoadmapProgress
                        }
                        onBackToDashboard={
                            handleDashboard
                        }
                    />
                </main>
            </div>
        );
    }

    /*
     * =========================================================
     * SETTINGS PAGE
     * =========================================================
     */

    if (activePage === "settings") {
        return (
            <div className="app">
                <Sidebar
                    onLogout={handleLogout}
                    onProfile={handleProfile}
                    onSettings={handleSettings}
                />

                <main className="main-content">
                    <Settings
                        targetRole={targetRole}
                        onSaveTargetRole={(newRole) => {
                            setTargetRole(newRole);
                        }}
                        onBackToDashboard={
                            handleDashboard
                        }
                    />
                </main>
            </div>
        );
    }

    /*
     * =========================================================
     * MAIN DASHBOARD
     * =========================================================
     */

    return (
        <div className="app">

            {/* Sidebar */}

            <Sidebar
                onLogout={handleLogout}
                onProfile={handleProfile}
                onSettings={handleSettings}
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
                        value={
                            latestAnalysis
                                ? `${latestAnalysis.matchScore || 0}%`
                                : "0%"
                        }
                        description={
                            latestAnalysis
                                ? "Based on your latest AI analysis"
                                : "No analysis available yet"
                        }
                        icon="📈"
                    />

                    <StatCard
                        title="Skills Matched"
                        value={
                            latestAnalysis
                                ? latestAnalysis.matchedSkills?.length || 0
                                : 0
                        }
                        description="Skills match your target role"
                        icon="✓"
                    />

                    <StatCard
                        title="Skill Gaps"
                        value={
                            latestAnalysis
                                ? latestAnalysis.missingSkills?.length || 0
                                : 0
                        }
                        description="Skills need improvement"
                        icon="⚠️"
                    />

                    <StatCard
                        title="Learning Progress"
                        value={`${overallRoadmapProgress || 0}%`}
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
                                {latestAnalysis
                                    ? `${latestAnalysis.matchScore || 0}%`
                                    : "0%"}
                            </strong>
                        </div>

                        <div className="progress">
                            <div
                                className="progress-bar"
                                style={{
                                    width: `${
                                        latestAnalysis
                                            ? latestAnalysis.matchScore || 0
                                            : 0
                                    }%`
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
                        onAnalyze={
                            handleAnalyzeJob
                        }
                    />
                </div>

                {/* AI ANALYSIS RESULTS */}

                <AnalysisResults
                    analysis={latestAnalysis}
                    onRoadmapProgressChange={
                        setRoadmapProgress
                    }
                    onOverallRoadmapProgressChange={
                        setOverallRoadmapProgress
                    }
                />

                {/* ANALYSIS HISTORY */}

                <AnalysisHistory
                    analyses={analyses}
                    onViewAnalysis={
                        handleViewAnalysis
                    }
                    onDeleteAnalysis={
                        handleDeleteAnalysis
                    }
                />

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

                        {latestAnalysis &&
                        latestAnalysis.missingSkills &&
                        latestAnalysis.missingSkills.length >
                            0 ? (
                            latestAnalysis.missingSkills.map(
                                (skill, index) => (
                                    <SkillGap
                                        key={`${skill}-${index}`}
                                        skill={skill}
                                        priority={
                                            index === 0
                                                ? "High"
                                                : "Medium"
                                        }
                                        progress={
                                            roadmapProgress[skill] || 0
                                        }
                                    />
                                )
                            )
                        ) : (
                            <p className="empty-state">
                                No skill gaps available yet.
                                Analyze a job description to
                                see your skill gaps.
                            </p>
                        )}

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