import { useState } from "react";

function Login({
    onLogin,
    onGoToRegister,
    registrationSuccess
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed.");
                return;
            }

            localStorage.setItem(
                "careerAI_token",
                data.token
            );

            localStorage.setItem(
                "careerAI_user",
                JSON.stringify(data.user)
            );

            setMessage("Login successful!");

            if (onLogin) {
                onLogin(data.user);
            }
        } catch (error) {
            console.error("Login error:", error);

            setMessage(
                "Unable to connect to the CareerAI server."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (event) => {
        event.preventDefault();

        setMessage("");

        if (!email.trim()) {
            setMessage("Please enter your registered email address.");
            return;
        }

        if (!newPassword || !confirmPassword) {
            setMessage("Please enter and confirm your new password.");
            return;
        }

        if (newPassword.length < 6) {
            setMessage(
                "New password must be at least 6 characters long."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/users/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim().toLowerCase(),
                        newPassword,
                        confirmPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Password reset failed."
                );
                return;
            }

            setMessage(
                "Your password has been reset successfully. Please log in."
            );

            setPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setShowNewPassword(false);
            setShowConfirmPassword(false);

            setForgotPasswordMode(false);
        } catch (error) {
            console.error("Password reset error:", error);

            setMessage(
                "Unable to connect to the CareerAI server."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        setForgotPasswordMode(false);
        setMessage("");
        setNewPassword("");
        setConfirmPassword("");
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    return (
        <div className="auth-page">

            {/* Registration Success Message */}
            {registrationSuccess && (
                <div className="registration-success">
                    <span className="success-icon">
                        ✓
                    </span>

                    <div>
                        <strong>
                            Your account was created successfully!
                        </strong>

                        <p>
                            Please sign in to continue.
                        </p>
                    </div>
                </div>
            )}

            <div className="auth-card">

                <div className="auth-header">
                    <h1>✦ CareerAI</h1>

                    <p>
                        Career Intelligence Platform
                    </p>
                </div>

                {!forgotPasswordMode ? (
                    <>
                        <h2>
                            Sign in to CareerAI
                        </h2>

                        <p className="auth-subtitle">
                            Access your career readiness dashboard
                            and continue your analysis.
                        </p>

                        <form onSubmit={handleLogin}>

                            <label htmlFor="login-email">
                                Email
                            </label>

                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="Enter your email"
                                required
                            />

                            <label htmlFor="login-password">
                                Password
                            </label>

                            <div className="password-input-wrapper">

                                <input
                                    id="login-password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Enter your password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) => !previous
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    title={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 3l18 18" />
                                            <path d="M10.7 10.7a2 2 0 0 0 2.6 2.6" />
                                            <path d="M6.6 6.6C4.4 8.1 2.9 10.2 2 12c1.3 2.7 4.7 7 10 7 1.8 0 3.4-.5 4.8-1.2" />
                                            <path d="M9.4 5.2c.8-.3 1.7-.5 2.6-.5 5.3 0 8.7 4.3 10 7.3-.5 1.1-1.2 2.3-2.2 3.4" />
                                        </svg>
                                    ) : (
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="2.8"
                                            />
                                        </svg>
                                    )}
                                </button>

                            </div>

                            <div className="forgot-password-row">
                                <button
                                    type="button"
                                    className="forgot-password-button"
                                    onClick={() => {
                                        setForgotPasswordMode(true);
                                        setMessage("");
                                        setPassword("");
                                    }}
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Logging in..."
                                    : "Login"}
                            </button>

                        </form>
                    </>
                ) : (
                    <>
                        <h2>
                            Reset Your Password
                        </h2>

                        <p className="auth-subtitle">
                            Enter your registered email and choose a new password.
                        </p>

                        <form onSubmit={handleForgotPassword}>

                            <label htmlFor="reset-email">
                                Registered Email
                            </label>

                            <input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="Enter your registered email"
                                required
                            />

                            <label htmlFor="new-password">
                                New Password
                            </label>

                            <div className="password-input-wrapper">

                                <input
                                    id="new-password"
                                    type={
                                        showNewPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(event.target.value)
                                    }
                                    placeholder="Enter new password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowNewPassword(
                                            (previous) => !previous
                                        )
                                    }
                                    aria-label={
                                        showNewPassword
                                            ? "Hide new password"
                                            : "Show new password"
                                    }
                                    title={
                                        showNewPassword
                                            ? "Hide new password"
                                            : "Show new password"
                                    }
                                >
                                    {showNewPassword ? (
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 3l18 18" />
                                            <path d="M10.7 10.7a2 2 0 0 0 2.6 2.6" />
                                            <path d="M6.6 6.6C4.4 8.1 2.9 10.2 2 12c1.3 2.7 4.7 7 10 7 1.8 0 3.4-.5 4.8-1.2" />
                                            <path d="M9.4 5.2c.8-.3 1.7-.5 2.6-.5 5.3 0 8.7 4.3 10 7.3-.5 1.1-1.2 2.3-2.2 3.4" />
                                        </svg>
                                    ) : (
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="2.8"
                                            />
                                        </svg>
                                    )}
                                </button>

                            </div>

                            <label htmlFor="confirm-password">
                                Confirm New Password
                            </label>

                            <div className="password-input-wrapper">

                                <input
                                    id="confirm-password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                    placeholder="Confirm new password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (previous) => !previous
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                    title={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 3l18 18" />
                                            <path d="M10.7 10.7a2 2 0 0 0 2.6 2.6" />
                                            <path d="M6.6 6.6C4.4 8.1 2.9 10.2 2 12c1.3 2.7 4.7 7 10 7 1.8 0 3.4-.5 4.8-1.2" />
                                            <path d="M9.4 5.2c.8-.3 1.7-.5 2.6-.5 5.3 0 8.7 4.3 10 7.3.5 1.1-1.2 2.3-2.2 3.4" />
                                        </svg>
                                    ) : (
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="2.8"
                                            />
                                        </svg>
                                    )}
                                </button>

                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Resetting Password..."
                                    : "Reset Password"}
                            </button>

                            <button
                                type="button"
                                className="back-to-login-button"
                                onClick={handleBackToLogin}
                            >
                                Back to Login
                            </button>

                        </form>
                    </>
                )}

                {message && (
                    <p className="auth-message">
                        {message}
                    </p>
                )}

                {!forgotPasswordMode && (
                    <div className="auth-switch">

                        <span>
                            Don't have an account?
                        </span>

                        <button
                            type="button"
                            className="auth-switch-button"
                            onClick={onGoToRegister}
                        >
                            Create Account
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Login;