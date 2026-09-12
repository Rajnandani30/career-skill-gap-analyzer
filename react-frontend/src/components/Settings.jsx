import { useEffect, useState } from "react";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

const getAuthToken = () =>
    localStorage.getItem("careerAI_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    "";

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

    // Delete account states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const rawUser =
                    localStorage.getItem("careerAI_user");

                const user = rawUser
                    ? JSON.parse(rawUser)
                    : {};

                setName(user?.name || user?.fullName || "");
                setEmail(user?.email || "");

                const savedSettings =
                    localStorage.getItem("careerAI_settings");

                if (savedSettings) {
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
                }

                /*
                 * If the backend settings endpoint exists,
                 * use MongoDB preferences as the latest source.
                 */
                const token = getAuthToken();

                if (token) {
                    const response = await fetch(
                        `${API_BASE_URL}/api/settings`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        const settings = data.settings || data;

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
                    }
                }
            } catch (error) {
                console.error(
                    "Unable to load settings:",
                    error
                );
            }
        };

        loadSettings();
    }, [targetRole]);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.remove("light-mode");
        } else {
            document.body.classList.add("light-mode");
        }
    }, [darkMode]);

    const handleSave = async () => {
        try {
            const rawUser = localStorage.getItem(
                "careerAI_user"
            );

            const currentUser = rawUser
                ? JSON.parse(rawUser)
                : {};

            const settingsPayload = {
                notifications,
                emailUpdates,
                darkMode,
                targetRole: role
            };

            /*
             * Keep a local copy so preferences remain available
             * during development and when the backend is offline.
             */
            localStorage.setItem(
                "careerAI_user",
                JSON.stringify({
                    ...currentUser,
                    name
                })
            );

            localStorage.setItem(
                "careerAI_settings",
                JSON.stringify(settingsPayload)
            );

            /*
             * Persist preferences in MongoDB when the authenticated
             * backend endpoint is available.
             */
            const token = getAuthToken();

            if (token) {
                const response = await fetch(
                    `${API_BASE_URL}/api/settings`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            name,
                            ...settingsPayload
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Unable to save settings to the server."
                    );
                }
            }

            if (onSaveTargetRole) {
                onSaveTargetRole(role);
            }

            setMessage(
                "✓ Settings saved successfully."
            );

            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (error) {
            console.error(
                "Unable to save settings:",
                error
            );

            setMessage(
                "Settings saved locally. Server synchronization is unavailable."
            );
        }
    };

    const handleTestEmail = async () => {
        setMessage("Sending test email...");

        try {
            const token = getAuthToken();

            if (!token) {
                setMessage("Please log in again before testing email.");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/notifications/test-email`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Test email could not be sent."
                );
            }

            setMessage(
                `✓ Test email sent successfully to ${data.email}`
            );

            setTimeout(() => {
                setMessage("");
            }, 5000);
        } catch (error) {
            console.error("Test email error:", error);
            setMessage(`✕ ${error.message}`);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setIsDeletingAccount(true);

            const token = getAuthToken();

            if (!token) {
                setMessage(
                    "Please log in again before deleting your account."
                );
                setShowDeleteModal(false);
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/users/me`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete account."
                );
            }

            // Clear authentication and user data
            localStorage.removeItem("careerAI_token");
            localStorage.removeItem("token");
            localStorage.removeItem("authToken");
            localStorage.removeItem("careerAI_user");
            localStorage.removeItem("careerAI_settings");

            setShowDeleteModal(false);

            // Redirect to the login page
            window.location.href = "/login";
        } catch (error) {
            console.error("Delete account error:", error);
            setMessage(`✕ ${error.message}`);
            setShowDeleteModal(false);
        } finally {
            setIsDeletingAccount(false);
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

                <button
                    type="button"
                    onClick={handleTestEmail}
                    style={{
                        marginTop: "20px",
                        padding: "12px 18px",
                        borderRadius: "10px",
                        border: "1px solid #8b5cf6",
                        background: "transparent",
                        color: "#c4b5fd",
                        cursor: "pointer",
                        fontWeight: "600"
                    }}
                >
                    ✉ Send Test Email
                </button>

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
    ✓ AUTHENTICATION ENABLED
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

            {/* Danger Zone */}

<section className="danger-zone">
  <div className="settings-section-heading">
    <div>
      <h3>⚠️ Danger Zone</h3>

      <p className="danger-zone-description">
        Permanently delete your CareerAI account and all associated
        application data.
      </p>
    </div>
  </div>

  <div className="danger-zone-card">
    <strong>Delete Account Permanently</strong>

    <p>
      This action will permanently delete your account, resume analyses,
      uploaded resumes, learning roadmaps, and saved preferences. This action
      cannot be undone.
    </p>

    <button
      type="button"
      className="delete-account-button"
      onClick={() => setShowDeleteModal(true)}
    >
      Delete Account
    </button>
  </div>
</section>

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

            {/* Delete Account Confirmation Modal */}

            {showDeleteModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.75)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                        zIndex: 9999
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-account-title"
                        style={{
                            width: "100%",
                            maxWidth: "480px",
                            borderRadius: "18px",
                            padding: "28px",
                            background:
                                "linear-gradient(145deg, #1f2937, #111827)",
                            border: "1px solid rgba(239, 68, 68, 0.5)",
                            boxShadow:
                                "0 25px 80px rgba(0, 0, 0, 0.55)"
                        }}
                    >
                        <div
                            style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(239, 68, 68, 0.15)",
                                fontSize: "25px",
                                marginBottom: "18px"
                            }}
                        >
                            ⚠️
                        </div>

                        <h2
                            id="delete-account-title"
                            style={{
                                margin: "0 0 12px",
                                color: "#f9fafb",
                                fontSize: "24px"
                            }}
                        >
                            Delete your account?
                        </h2>

                        <p
                            style={{
                                color: "#d1d5db",
                                lineHeight: 1.7,
                                marginBottom: "12px"
                            }}
                        >
                            Are you sure you want to delete this account?
                        </p>

                        <p
                            style={{
                                color: "#fca5a5",
                                lineHeight: 1.6,
                                fontSize: "14px",
                                marginBottom: "25px"
                            }}
                        >
                            Your account, resume analyses, resumes,
                            learning roadmaps, and associated data
                            will be permanently deleted. This action
                            cannot be undone.
                        </p>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "12px",
                                flexWrap: "wrap"
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeletingAccount}
                                style={{
                                    padding: "11px 18px",
                                    borderRadius: "10px",
                                    border: "1px solid #4b5563",
                                    background: "transparent",
                                    color: "#d1d5db",
                                    cursor: isDeletingAccount
                                        ? "not-allowed"
                                        : "pointer",
                                    fontWeight: "600",
                                    opacity: isDeletingAccount ? 0.6 : 1
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                disabled={isDeletingAccount}
                                style={{
                                    padding: "11px 18px",
                                    borderRadius: "10px",
                                    border: "1px solid #dc2626",
                                    background: "#dc2626",
                                    color: "#ffffff",
                                    cursor: isDeletingAccount
                                        ? "not-allowed"
                                        : "pointer",
                                    fontWeight: "700",
                                    opacity: isDeletingAccount ? 0.7 : 1
                                }}
                            >
                                {isDeletingAccount
                                    ? "Deleting..."
                                    : "Delete Permanently"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Settings;