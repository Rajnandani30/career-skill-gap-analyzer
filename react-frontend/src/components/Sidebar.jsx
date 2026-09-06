function Sidebar({ onLogout }) {

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

            <div className="sidebar-logo">
                <h2>✦ CareerAI</h2>
                <p>Career Intelligence Platform</p>
            </div>

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

                <a href="#">
                    📚 Learning Roadmap
                </a>

                <a href="#">
                    🎤 Interview Prep
                </a>

                <a href="#">
                    🕘 Analysis History
                </a>

            </nav>

            <div className="sidebar-bottom">

                <a href="#">
                    👤 My Profile
                </a>

                <a href="#">
                    ⚙️ Settings
                </a>

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