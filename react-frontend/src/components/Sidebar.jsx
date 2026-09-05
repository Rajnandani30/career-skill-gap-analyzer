function Sidebar() {
    return (
        <div className="sidebar">

            {/* Logo */}
            <div className="sidebar-logo">
                <h2>✦ CareerAI</h2>
                <p>Career Intelligence Platform</p>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">

                <a href="#" className="active">
                    🏠 Dashboard
                </a>

                <a href="#">
                    📄 Resume Analysis
                </a>

                <a href="#">
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

            {/* Bottom Navigation */}
            <div className="sidebar-bottom">

                <a href="#">
                    👤 My Profile
                </a>

                <a href="#">
                    ⚙️ Settings
                </a>

            </div>

        </div>
    );
}

export default Sidebar;