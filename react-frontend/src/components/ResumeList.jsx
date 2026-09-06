function ResumeList({
    resumes,
    selectedResumeId,
    onSelectResume,
    onDeleteResume,
    onAddResume
}) {
    return (
        <div className="resume-list">

            <div className="resume-list-header">
                <div className="resume-list-title">
                    <div className="resume-list-icon">
                        📄
                    </div>

                    <div>
                        <h3>My Resumes</h3>

                        <p>
                            Manage your saved resumes and
                            select one for career analysis.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="add-resume-button"
                    onClick={onAddResume}
                >
                    <span>＋</span>
                    Add New Resume
                </button>
            </div>

            {resumes.length > 0 && (
                <div className="resume-cards">

                    {resumes.map((resume) => {

                        const isSelected =
                            selectedResumeId === resume._id;

                        return (
                            <div
                                className={`resume-item ${
                                    isSelected
                                        ? "resume-item-active"
                                        : ""
                                }`}
                                key={resume._id}
                            >

                                <div className="resume-item-info">

                                    <div className="resume-item-icon">
                                        📄
                                    </div>

                                    <div className="resume-item-details">

                                        <div className="resume-item-title-row">

                                            <h4>
                                                {resume.title ||
                                                    "Untitled Resume"}
                                            </h4>

                                            {isSelected && (
                                                <span className="active-resume-badge">
                                                    ✓ Active
                                                </span>
                                            )}

                                        </div>

                                        <p className="resume-preview">
                                            {resume.resumeText
                                                .slice(0, 120)
                                                .replace(/\s+/g, " ")}

                                            {resume.resumeText.length > 120
                                                ? "..."
                                                : ""}
                                        </p>

                                        <small>
                                            Updated{" "}
                                            {new Date(
                                                resume.updatedAt
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )}
                                        </small>

                                    </div>

                                </div>

                                <div className="resume-item-actions">

                                    <button
                                        type="button"
                                        className="select-resume-button"
                                        onClick={() =>
                                            onSelectResume(
                                                resume
                                            )
                                        }
                                    >
                                        {isSelected
                                            ? "Selected"
                                            : "Use for Analysis"}
                                    </button>

                                    <button
                                        type="button"
                                        className="delete-resume-button"
                                        onClick={() =>
                                            onDeleteResume(
                                                resume._id
                                            )
                                        }
                                    >
                                        🗑 Delete
                                    </button>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

            {resumes.length === 0 && (
                <div className="empty-resumes">

                    <div className="empty-resumes-icon">
                        📄
                    </div>

                    <h4>No resumes saved yet</h4>

                    <p>
                        Your saved resumes will appear here.
                        Click <strong>Add New Resume</strong>{" "}
                        above to create your first resume.
                    </p>

                </div>
            )}

        </div>
    );
}

export default ResumeList;