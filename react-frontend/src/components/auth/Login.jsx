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

                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Enter your password"
                        required
                    />

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