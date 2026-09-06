import { useState } from "react";

function Register({ onRegisterSuccess, onGoToLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setMessage(
                "Password must be at least 6 characters."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Registration failed."
                );
                return;
            }

            setMessage(
                "Registration successful! You can now log in."
            );

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            if (onRegisterSuccess) {
                onRegisterSuccess();
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

            <div className="auth-card">

                <div className="auth-header">
                    <h1>✦ CareerAI</h1>

                    <p>
                        Career Intelligence Platform
                    </p>
                </div>

                <h2>Create your CareerAI account</h2>

                <p className="auth-subtitle">
                    Start analyzing your skills and build
                    your career roadmap.
                </p>

                <form onSubmit={handleSubmit}>

                    <label htmlFor="register-name">
                        Full Name
                    </label>

                    <input
                        id="register-name"
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        placeholder="Enter your full name"
                        required
                    />

                    <label htmlFor="register-email">
                        Email
                    </label>

                    <input
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="Enter your email"
                        required
                    />

                    <label htmlFor="register-password">
                        Password
                    </label>

                    <input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Create a password"
                        required
                    />

                    <label htmlFor="confirm-password">
                        Confirm Password
                    </label>

                    <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        placeholder="Confirm your password"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>

                {message && (
                    <p className="auth-message">
                        {message}
                    </p>
                )}

                <div className="auth-switch">
                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        className="auth-switch-button"
                        onClick={onGoToLogin}
                    >
                        Sign in
                    </button>
                </div>

            </div>

        </div>
    );
}

export default Register;