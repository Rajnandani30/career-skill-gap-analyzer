import "./App.css";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import QuickActions from "./components/QuickActions";
import SkillGap from "./components/SkillGap";

function App() {
    const [targetRole, setTargetRole] = useState("Full Stack Developer");

    // Event handler for Quick Actions
    const handleAction = (action) => {

        if (action === "resume") {
            alert("Resume Analysis feature coming soon!");
        }

        if (action === "skills") {
            alert("Skill Gap Analysis feature coming soon!");
        }

        if (action === "roadmap") {
            alert("Learning Roadmap feature coming soon!");
        }

        if (action === "interview") {
            alert("Interview Preparation feature coming soon!");
        }
    };

    return (
        <div className="app">

            {/* Sidebar */}
            <Sidebar />

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
                            <h2>
    🎯 {targetRole}
</h2>
                        </h2>

                        <p>
                            CareerAI is analyzing your skills against
                            your target role.
                        </p>
                    </div>

                    <button>
                        <button
    onClick={() => {
        const newRole = prompt("Enter your target career role:");

        if (newRole && newRole.trim() !== "") {
            setTargetRole(newRole);
        }
    }}
>
    ✏️ Change Target Role
</button>
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
                                <h3>Career Readiness</h3>

                                <p>
                                    Your overall readiness for the target role.
                                </p>
                            </div>

                            <strong>78%</strong>

                        </div>

                        <div className="progress">
                            <div
                                className="progress-bar"
                                style={{ width: "78%" }}
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


                {/* Skill Gaps */}
                <div className="dashboard-card skill-section">

                    <div className="card-header">

                        <div>
                            <h3>🎯 Your Top Skill Gaps</h3>

                            <p>
                                Focus on these skills to improve your
                                career readiness.
                            </p>
                        </div>

                        <button>
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
                    © 2026 CareerAI — AI-Powered Career Readiness Platform
                </footer>

            </main>

        </div>
    );
}

export default App;