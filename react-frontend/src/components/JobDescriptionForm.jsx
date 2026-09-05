function JobDescriptionForm({
    jobDescription,
    setJobDescription,
    targetRole,
    setTargetRole,
    onAnalyze
}) {
    return (
        <div className="job-description-form">

            <div className="job-form-header">
                <h3>💼 Target Job Analysis</h3>

                <p>
                    Enter the job role and description you want CareerAI
                    to compare with your skills.
                </p>
            </div>

            {/* Target Role */}

            <label htmlFor="targetRole">
                Target Job Role
            </label>

            <input
                id="targetRole"
                type="text"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                placeholder="e.g. Full Stack Developer"
            />

            {/* Job Description */}

            <label htmlFor="jobDescription">
                Job Description
            </label>

            <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(event) =>
                    setJobDescription(event.target.value)
                }
                placeholder="Paste the job description here..."
                rows="10"
            ></textarea>

            <div className="job-form-footer">

                <small>
                    {jobDescription.length} characters
                </small>

                <button
                    onClick={onAnalyze}
                    disabled={
                        targetRole.trim() === "" ||
                        jobDescription.trim() === ""
                    }
                >
                    🎯 Analyze Job Requirements
                </button>

            </div>

        </div>
    );
}

export default JobDescriptionForm;