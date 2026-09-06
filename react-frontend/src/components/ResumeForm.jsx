import { useState } from "react";

function ResumeForm({
    resumeTitle,
    setResumeTitle,
    resumeText,
    setResumeText,
    onAnalyze
}) {
    const isEmpty =
        resumeTitle.trim() === "" ||
        resumeText.trim() === "";

    return (
        <div className="resume-form">

            <div className="resume-form-header">
                <div className="resume-form-title">
                    <div className="resume-form-icon">
                        ✦
                    </div>

                    <div>
                        <h3>Resume Editor</h3>

                        <p>
                            Add or update your resume to use it
                            for personalized CareerAI analysis.
                        </p>
                    </div>
                </div>

                <span className="resume-editor-status">
                    {isEmpty
                        ? "New Resume"
                        : "Ready to Save"}
                </span>
            </div>

            <div className="resume-editor-body">

                <label htmlFor="resume-title">
                    Resume Title
                </label>

                <input
                    id="resume-title"
                    type="text"
                    value={resumeTitle}
                    onChange={(event) =>
                        setResumeTitle(event.target.value)
                    }
                    placeholder="e.g. Full Stack Developer Resume"
                />

                <label htmlFor="resume">
                    Resume Content
                </label>

                <textarea
                    id="resume"
                    value={resumeText}
                    onChange={(event) =>
                        setResumeText(event.target.value)
                    }
                    placeholder={
                        "Paste your resume content here...\n\n" +
                        "For example:\n" +
                        "Education\n" +
                        "Skills\n" +
                        "Projects\n" +
                        "Experience\n" +
                        "Certifications"
                    }
                    rows="14"
                ></textarea>
            </div>

            <div className="resume-form-footer">

                <div className="resume-character-info">
                    <span>
                        {resumeText.length.toLocaleString()} characters
                    </span>

                    {!isEmpty && (
                        <span className="resume-ready">
                            ✓ Resume ready
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onAnalyze}
                    disabled={isEmpty}
                    className="save-resume-button"
                >
                    Save Resume
                </button>

            </div>

        </div>
    );
}

export default ResumeForm;