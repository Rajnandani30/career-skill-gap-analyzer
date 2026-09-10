import { useMemo, useState } from "react";

function Profile({
    targetRole = "Full Stack Developer",
    resumes = [],
    analyses = [],
    roadmapProgress = 0,
    onBackToDashboard
}) {
    const storedUser = useMemo(() => {
        try {
            const rawUser =
                localStorage.getItem("careerAI_user");

            return rawUser ? JSON.parse(rawUser) : {};
        } catch (error) {
            console.error("Unable to read profile data:", error);
            return {};
        }
    }, []);

    const getInitialName = () => {
        return (
            storedUser?.name ||
            storedUser?.fullName ||
            storedUser?.username ||
            "CareerAI User"
        );
    };

    const getInitialEmail = () => {
        return storedUser?.email || "Email not available";
    };

    const [name, setName] = useState(getInitialName());
    const [email] = useState(getInitialEmail());
    const [isEditing, setIsEditing] = useState(false);

    const displayName = name.trim() || "CareerAI User";

    const initials = displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

    const matchedSkills =
        analyses?.[0]?.matchedSkills?.length || 0;

    const skillGaps =
        analyses?.[0]?.missingSkills?.length || 0;

    const handleSaveProfile = () => {
        const currentUser = {
            ...storedUser,
            name: displayName
        };

        localStorage.setItem(
            "careerAI_user",
            JSON.stringify(currentUser)
        );

        setIsEditing(false);
    };

    return (
        <div className="profile-page">

            {/* Page Header */}
            <div className="profile-page-header">
                <div>
                    <p className="section-label">
                        ACCOUNT
                    </p>

                    <h1>My Profile</h1>

                    <p>
                        Manage your CareerAI profile and
                        review your career readiness overview.
                    </p>
                </div>

                <button
                    type="button"
                    className="profile-back-button"
                    onClick={onBackToDashboard}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* Profile Hero */}
            <div className="profile-hero-card">

                <div className="profile-avatar">
                    {initials || "U"}
                </div>

                <div className="profile-identity">
                    <span className="profile-status">
                        ● ACTIVE ACCOUNT
                    </span>

                    <h2>{displayName}</h2>

                    <p>{email}</p>

                    <div className="profile-role">
                        🎯 Target Role:
                        <strong>{targetRole}</strong>
                    </div>
                </div>

                <button
                    type="button"
                    className="profile-edit-button"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    ✏️ {isEditing ? "Cancel" : "Edit Profile"}
                </button>
            </div>

            {/* Edit Profile */}
            {isEditing && (
                <div className="profile-section-card">
                    <div className="profile-section-heading">
                        <div>
                            <h3>Personal Information</h3>
                            <p>
                                Update the name displayed across
                                your CareerAI account.
                            </p>
                        </div>
                    </div>

                    <div className="profile-form-grid">
                        <div className="profile-form-group">
                            <label>Full Name</label>

                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Email Address</label>

                            <input
                                type="email"
                                value={email}
                                disabled
                            />

                            <small>
                                Email is managed by your account.
                            </small>
                        </div>
                    </div>

                    <div className="profile-form-actions">
                        <button
                            type="button"
                            className="profile-save-button"
                            onClick={handleSaveProfile}
                        >
                            ✓ Save Changes
                        </button>

                        <button
                            type="button"
                            className="profile-cancel-button"
                            onClick={() => {
                                setName(getInitialName());
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Career Overview */}
            <div className="profile-section-card">

                <div className="profile-section-heading">
                    <div>
                        <h3>Career Overview</h3>
                        <p>
                            Your current progress across the
                            CareerAI platform.
                        </p>
                    </div>
                </div>

                <div className="profile-stat-grid">

                    <div className="profile-stat-card">
                        <span className="profile-stat-icon">
                            🎯
                        </span>

                        <div>
                            <strong>{targetRole}</strong>
                            <p>Target Career</p>
                        </div>
                    </div>

                    <div className="profile-stat-card">
                        <span className="profile-stat-icon">
                            📄
                        </span>

                        <div>
                            <strong>{resumes.length}</strong>
                            <p>Saved Resumes</p>
                        </div>
                    </div>

                    <div className="profile-stat-card">
                        <span className="profile-stat-icon">
                            📊
                        </span>

                        <div>
                            <strong>{analyses.length}</strong>
                            <p>AI Analyses</p>
                        </div>
                    </div>

                    <div className="profile-stat-card">
                        <span className="profile-stat-icon">
                            📚
                        </span>

                        <div>
                            <strong>{roadmapProgress}%</strong>
                            <p>Learning Progress</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Latest Career Analysis */}
            <div className="profile-section-card">

                <div className="profile-section-heading">
                    <div>
                        <h3>Latest Career Analysis</h3>
                        <p>
                            Snapshot of your most recent
                            AI-powered career assessment.
                        </p>
                    </div>

                    <span className="profile-analysis-badge">
                        AI ANALYZED
                    </span>
                </div>

                <div className="profile-analysis-grid">

                    <div className="profile-analysis-score">
                        <span>Career Readiness</span>

                        <strong>
                            {analyses?.[0]?.matchScore ?? 0}%
                        </strong>

                        <div className="profile-progress">
                            <div
                                style={{
                                    width: `${
                                        analyses?.[0]
                                            ?.matchScore ?? 0
                                    }%`
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="profile-analysis-item">
                        <span>✓ Skills Matched</span>
                        <strong>{matchedSkills}</strong>
                    </div>

                    <div className="profile-analysis-item">
                        <span>⚠️ Skill Gaps</span>
                        <strong>{skillGaps}</strong>
                    </div>

                </div>
            </div>

            {/* Account Information */}
            <div className="profile-section-card">

                <div className="profile-section-heading">
                    <div>
                        <h3>Account Information</h3>
                        <p>
                            Basic information associated with
                            your CareerAI account.
                        </p>
                    </div>
                </div>

                <div className="profile-info-list">

                    <div className="profile-info-row">
                        <span>Account Name</span>
                        <strong>{displayName}</strong>
                    </div>

                    <div className="profile-info-row">
                        <span>Email Address</span>
                        <strong>{email}</strong>
                    </div>

                    <div className="profile-info-row">
                        <span>Target Career</span>
                        <strong>{targetRole}</strong>
                    </div>

                    <div className="profile-info-row">
                        <span>Learning Status</span>
                        <strong>
                            {roadmapProgress === 100
                                ? "Roadmap Completed"
                                : "Learning in Progress"}
                        </strong>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Profile;
