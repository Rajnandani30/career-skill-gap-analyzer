import { useState } from "react";
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

function App() {
    const [targetRole, setTargetRole] = useState(
        "Full Stack Developer"
    );

    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("careerAI_token"))
    );

    // Controls Login / Register page
    const [showRegister, setShowRegister] = useState(false);

    // Controls registration success message
    const [registrationSuccess, setRegistrationSuccess] =
        useState(false);

    // Handle successful login
    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowRegister(false);
        setRegistrationSuccess(false);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("careerAI_token");
        localStorage.removeItem("careerAI_user");

        setIsLoggedIn(false);
        setShowRegister(false);
        setRegistrationSuccess(false);
    };

    // Handle successful registration
    const handleRegisterSuccess = () => {
        setShowRegister(false);
        setRegistrationSuccess(true);
    };

    // Handle Quick Actions
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
     * Authentication Screens
     */

    if (!isLoggedIn) {

        // Registration page
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

        // Login page
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
     * Main CareerAI Dashboard
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
                            CareerAI is analyzing your skills
                            against your target role.
                        </p>

                    </div>

                    <button
                        onClick={() => {
                            const newRole = prompt(
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

                {/* Main Dashboard Grid */}
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

                {/* Resume Analysis */}
                <div
                    className="dashboard-card"
                    id="resume-analysis"
                >

                    <ResumeForm
                        resumeText={resumeText}
                        setResumeText={setResumeText}

                        onAnalyze={() => {
                            alert(
                                `Resume received! ${resumeText.length} characters ready for AI analysis.`
                            );
                        }}
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
                                        behavior: "smooth"
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