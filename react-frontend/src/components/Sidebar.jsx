function Sidebar({
    onLogout,
    onProfile,
    onSettings
}) {
    const handleLogoutClick = () => {
        const confirmed = window.confirm(
            "Are you sure you want to logout?"
        );

        if (confirmed) {
            onLogout();
        }
    };

    return (
        <div className="sidebar">

            {/* Logo */}
            <div className="sidebar-logo">
                <h2>✦ CareerAI</h2>
                <p>Career Intelligence Platform</p>
            </div>

            {/* Main Navigation */}
            <nav className="sidebar-nav">

                <a href="#" className="active">
                    🏠 Dashboard
                </a>

                <a href="#resume-analysis">
                    📄 Resume Analysis
                </a>

                <a href="#skill-gaps">
                    🎯 Skill Gap
                </a>

                <a href="#learning-roadmap">
                    📚 Learning Roadmap
                </a>

                <a href="#interview-preparation">
                    🎤 Interview Prep
                </a>

                <a href="#analysis-history">
                    🕘 Analysis History
                </a>

            </nav>

            {/* Bottom Navigation */}
            <div className="sidebar-bottom">

                {/* My Profile */}
                <button
                    type="button"
                    className="sidebar-bottom-link"
                    onClick={onProfile}
                >
                    👤 My Profile
                </button>

                {/* Settings */}
                <button
                    type="button"
                    className="sidebar-bottom-link"
                    onClick={onSettings}
                >
                    ⚙️ Settings
                </button>

                {/* Logout */}
                <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogoutClick}
                >
                    🚪 Logout
                </button>

            </div>

        </div>
    );
}

export default Sidebar;