import { useState } from "react";

function Login({
    onLogin,
    onGoToRegister,
    registrationSuccess
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
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
                setMessage(
                    data.message || "Login failed."
                );
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
            setMessage(
                "Unable to connect to the CareerAI server."
            );
        } finally {
            setLoading(false);
        }
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

                <h2>
                    Sign in to CareerAI
                </h2>

                <p className="auth-subtitle">
                    Access your career readiness dashboard
                    and continue your analysis.
                </p>

                <form onSubmit={handleSubmit}>

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

                    {/* Password Input with Show/Hide Feature */}
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
                                /* Slashed Eye - Password Visible */
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
                                /* Normal Eye - Password Hidden */
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
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                {message && (
                    <p className="auth-message">
                        {message}
                    </p>
                )}

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

            </div>

        </div>
    );
}

export default Login;