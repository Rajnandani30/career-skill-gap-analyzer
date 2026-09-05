function SkillGap({ skill, priority, progress }) {
    return (
        <div className="skill-gap-card">

            <div className="skill-gap-header">
                <div>
                    <h4>{skill}</h4>
                    <span>{priority} Priority</span>
                </div>

                <strong>{progress}%</strong>
            </div>

            <div className="skill-progress">
                <div
                    className="skill-progress-bar"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

        </div>
    );
}

export default SkillGap;