function QuickActions({ onAction }) {
    return (
        <div className="quick-actions">

            <h3>Quick Actions</h3>

            <button onClick={() => onAction("resume")}>
                📄 Analyze My Resume
            </button>

            <button onClick={() => onAction("skills")}>
                🎯 Check Skill Gap
            </button>

            <button onClick={() => onAction("roadmap")}>
                📚 View Learning Roadmap
            </button>

            <button onClick={() => onAction("interview")}>
                🎤 Start Interview Prep
            </button>

        </div>
    );
}

export default QuickActions;