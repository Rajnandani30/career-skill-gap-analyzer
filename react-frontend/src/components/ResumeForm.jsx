function ResumeForm({ resumeText, setResumeText, onAnalyze }) {
    return (
        <div className="resume-form">

            <div className="resume-form-header">
                <div>
                    <h3>📄 Resume Analysis</h3>

                    <p>
                        Paste your resume below and CareerAI will
                        analyze your skills.
                    </p>
                </div>
            </div>

            <label htmlFor="resume">
                Resume Content
            </label>

            <textarea
                id="resume"
                value={resumeText}
                onChange={(event) => setResumeText(event.target.value)}
                placeholder="Paste your resume text here..."
                rows="12"
            ></textarea>

            <div className="resume-form-footer">

                <small>
                    {resumeText.length} characters
                </small>

                <button
                    onClick={onAnalyze}
                    disabled={resumeText.trim() === ""}
                >
                    🤖 Analyze Resume
                </button>

            </div>

        </div>
    );
}

export default ResumeForm;