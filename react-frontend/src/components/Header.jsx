function Header() {
    return (
        <div className="dashboard-header">

            <div>
                <h1>Career Dashboard</h1>

                <p>
                    Welcome back! Let's improve your career readiness.
                </p>
            </div>

            <div className="profile-section">

                <div className="profile-info">
                    <strong>Student</strong>
                    <small>Career Explorer</small>
                </div>

                <div className="profile-icon">
                    👤
                </div>

            </div>

        </div>
    );
}

export default Header;