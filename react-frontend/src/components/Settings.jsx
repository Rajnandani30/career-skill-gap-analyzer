import { useEffect, useState } from "react";

function Settings({
    targetRole = "Full Stack Developer",
    onSaveTargetRole,
    onBackToDashboard
}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(targetRole);
    const [notifications, setNotifications] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        try {
            const rawUser = localStorage.getItem("careerAI_user");
            const user = rawUser ? JSON.parse(rawUser) : {};

            setName(user?.name || user?.fullName || "");
            setEmail(user?.email || "");
        } catch (error) {
            console.error("Unable to load settings:", error);
        }

        const savedSettings =
            localStorage.getItem("careerAI_settings");

        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);

                setNotifications(
                    settings.notifications ?? true
                );
                setEmailUpdates(
                    settings.emailUpdates ?? true
                );
                setDarkMode(
                    settings.darkMode ?? true
                );
                setRole(
                    settings.targetRole || targetRole
                );
            } catch (error) {
                console.error(
                    "Unable to load saved settings:",
                    error
                );
            }
        }
    }, [targetRole]);

    useEffect(() => {
    if (darkMode) {
        document.body.classList.remove("light-mode");
    } else {
        document.body.classList.add("light-mode");
    }
}, [darkMode]);

    const handleSave = () => {
        try {
            const rawUser = localStorage.getItem(
                "careerAI_user"
            );

            const currentUser = rawUser
                ? JSON.parse(rawUser)
                : {};

            localStorage.setItem(
                "careerAI_user",
                JSON.stringify({
                    ...currentUser,
                    name
                })
            );

            localStorage.setItem(
                "careerAI_settings",
                JSON.stringify({
                    notifications,
                    emailUpdates,
                    darkMode,
                    targetRole: role
                })
            );

            if (onSaveTargetRole) {
                onSaveTargetRole(role);
            }

            setMessage("✓ Settings saved successfully.");

            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (error) {
            console.error(
                "Unable to save settings:",
                error
            );

            setMessage(
                "Unable to save settings. Please try again."
            );
        }
    };

    const handleReset = () => {
        setNotifications(true);
        setEmailUpdates(true);
        setDarkMode(true);
        setRole(targetRole);

        setMessage("");
    };

    return (
        <div className="settings-page">

            <div className="settings-page-header">
                <div>
                    <p className="section-label">
                        PREFERENCES
                    </p>

                    <h1>Settings</h1>

                    <p>
                        Manage your CareerAI account,
                        career preferences and application
                        experience.
                    </p>
                </div>

                <button
                    type="button"
                    className="settings-back-button"
                    onClick={onBackToDashboard}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {message && (
                <div className="settings-success-message">
                    {message}
                </div>
            )}

            {/* Profile Settings */}

            <div className="settings-section-card">

                <div className="settings-section-heading">
                    <div>
                        <h3>👤 Profile Settings</h3>

                        <p>
                            Manage the personal information
                            associated with your CareerAI
                            account.
                        </p>
                    </div>
                </div>

                <div className="settings-form-grid">

                    <div className="settings-form-group">
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

                    <div className="settings-form-group">
                        <label>Email Address</label>

                        <input
                            type="email"
                            value={email}
                            disabled
                        />

                        <small>
                            Your email is linked to your
                            account.
                        </small>
                    </div>

                </div>

            </div>

            {/* Career Preferences */}

            <div className="settings-section-card">

                <div className="settings-section-heading">
                    <div>
                        <h3>🎯 Career Preferences</h3>

                        <p>
                            Tell CareerAI which career path
                            you are preparing for.
                        </p>
                    </div>
                </div>

                <div className="settings-form-grid">

                    <div className="settings-form-group">
                        <label>Target Career Role</label>

                        <select
                            value={role}
                            onChange={(event) =>
                                setRole(event.target.value)
                            }
                        >
                            <option>
                                Full Stack Developer
                            </option>

                            <option>
                                Frontend Developer
                            </option>

                            <option>
                                Backend Developer
                            </option>

                            <option>
                                React Developer
                            </option>

                            <option>
                                Node.js Developer
                            </option>

                            <option>
                                Software Engineer
                            </option>

                            <option>
                                Data Analyst
                            </option>

                            <option>
                                Data Scientist
                            </option>

                            <option>
                                AI / ML Engineer
                            </option>

                            <option>
                                DevOps Engineer
                            </option>

                        </select>
                    </div>

                </div>

            </div>

            {/* Appearance */}

            <div className="settings-section-card">

                <div className="settings-section-heading">
                    <div>
                        <h3>🎨 Appearance</h3>

                        <p>
                            Control how the CareerAI
                            interface appears.
                        </p>
                    </div>
                </div>

                <div className="settings-option-row">

                    <div>
                        <strong>Dark Interface</strong>

                        <p>
                            Keep the professional dark CareerAI
                            interface enabled.
                        </p>
                    </div>

                    <label className="settings-toggle">

                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={(event) =>
                                setDarkMode(
                                    event.target.checked
                                )
                            }
                        />

                        <span></span>

                    </label>

                </div>

            </div>

            {/* Notifications */}

            <div className="settings-section-card">

                <div className="settings-section-heading">
                    <div>
                        <h3>🔔 Notifications</h3>

                        <p>
                            Choose which CareerAI updates
                            you want to receive.
                        </p>
                    </div>
                </div>

                <div className="settings-option-list">

                    <div className="settings-option-row">

                        <div>
                            <strong>
                                Career Progress Notifications
                            </strong>

                            <p>
                                Receive updates about your
                                learning roadmap progress.
                            </p>
                        </div>

                        <label className="settings-toggle">

                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={(event) =>
                                    setNotifications(
                                        event.target.checked
                                    )
                                }
                            />

                            <span></span>

                        </label>

                    </div>

                    <div className="settings-option-row">

                        <div>
                            <strong>
                                Email Updates
                            </strong>

                            <p>
                                Receive important CareerAI
                                account and career updates.
                            </p>
                        </div>

                        <label className="settings-toggle">

                            <input
                                type="checkbox"
                                checked={emailUpdates}
                                onChange={(event) =>
                                    setEmailUpdates(
                                        event.target.checked
                                    )
                                }
                            />

                            <span></span>

                        </label>

                    </div>

                </div>

            </div>

            {/* Security */}

            <div className="settings-section-card">

                <div className="settings-section-heading">
                    <div>
                        <h3>🔐 Security</h3>

                        <p>
                            Security-related account controls.
                        </p>
                    </div>
                </div>

                <div className="settings-info-box">

                    <strong>Account Authentication</strong>

                    <p>
                        Your CareerAI account is protected by
                        the authentication system configured
                        for this application.
                    </p>

                    <span className="settings-status-badge">
                        ✓ ACCOUNT PROTECTED
                    </span>

                </div>

            </div>

            {/* Data & Privacy */}

            <div className="settings-section-card">

                <div className="settings-section-heading">
                    <div>
                        <h3>🛡️ Data & Privacy</h3>

                        <p>
                            Understand how your CareerAI
                            application data is handled.
                        </p>
                    </div>
                </div>

                <div className="settings-info-box">

                    <strong>Your Career Data</strong>

                    <p>
                        Your resume analyses, learning roadmap
                        progress and career preferences are
                        used to provide personalized CareerAI
                        features.
                    </p>

                    <p>
                        You can review and manage your
                        application data through the CareerAI
                        interface.
                    </p>

                </div>

            </div>

            {/* Actions */}

            <div className="settings-actions">

                <button
                    type="button"
                    className="settings-save-button"
                    onClick={handleSave}
                >
                    ✓ Save Changes
                </button>

                <button
                    type="button"
                    className="settings-reset-button"
                    onClick={handleReset}
                >
                    ↺ Reset
                </button>

            </div>

        </div>
    );
}

export default Settings;