function AnalysisHistory({
    analyses,
    onViewAnalysis,
    onDeleteAnalysis
}) {
    return (
        <section
            className="analysis-history"
            id="analysis-history"
        >
            <div className="analysis-history-header">
                <div>
                    <span className="analysis-eyebrow">
                        ✦ Your Career Journey
                    </span>

                    <h2>
                        🕘 Analysis History
                    </h2>

                    <p>
                        View and revisit your previous
                        CareerAI job analyses.
                    </p>
                </div>

                <div className="history-count-card">
                    <strong>
                        {analyses.length}
                    </strong>

                    <span>
                        {analyses.length === 1
                            ? "Analysis"
                            : "Analyses"}
                    </span>
                </div>
            </div>


            {analyses.length > 0 ? (
                <div className="analysis-history-list">

                    {analyses.map((analysis, index) => {

                        const matchScore =
                            analysis.matchScore || 0;

                        const matchedCount =
                            analysis.matchedSkills?.length || 0;

                        const missingCount =
                            analysis.missingSkills?.length || 0;

                        const analysisDate =
                            analysis.createdAt
                                ? new Date(
                                      analysis.createdAt
                                  ).toLocaleDateString(
                                      "en-IN",
                                      {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric"
                                      }
                                  )
                                : "Date unavailable";

                        const resumeTitle =
                            analysis.resumeId?.title ||
                            "Resume";

                        return (
                            <div
                                className="analysis-history-card"
                                key={
                                    analysis._id ||
                                    `analysis-${index}`
                                }
                            >

                                {/* TOP SECTION */}
                                <div className="history-card-top">

                                    <div className="history-card-title">

                                        <div className="history-card-icon">
                                            📊
                                        </div>

                                        <div>
                                            <h3>
                                                {analysis.targetRole ||
                                                    "Career Analysis"}
                                            </h3>

                                            <p>
                                                Analyzed on{" "}
                                                {analysisDate}
                                            </p>
                                        </div>

                                    </div>


                                    <div
                                        className={`history-score ${
                                            matchScore >= 80
                                                ? "history-score-high"
                                                : matchScore >= 60
                                                ? "history-score-medium"
                                                : "history-score-low"
                                        }`}
                                    >
                                        <strong>
                                            {matchScore}%
                                        </strong>

                                        <span>
                                            Match
                                        </span>
                                    </div>

                                </div>


                                {/* ANALYSIS INFORMATION */}
                                <div className="history-card-info">

                                    <div className="history-info-item">
                                        <span>
                                            📄 Resume
                                        </span>

                                        <strong>
                                            {resumeTitle}
                                        </strong>
                                    </div>


                                    <div className="history-info-item">
                                        <span>
                                            ✓ Matched Skills
                                        </span>

                                        <strong>
                                            {matchedCount}
                                        </strong>
                                    </div>


                                    <div className="history-info-item">
                                        <span>
                                            ⚠️ Skill Gaps
                                        </span>

                                        <strong>
                                            {missingCount}
                                        </strong>
                                    </div>

                                </div>


                                {/* SUMMARY */}
                                {analysis.analysisSummary && (
                                    <div className="history-summary">

                                        <strong>
                                            🤖 AI Summary
                                        </strong>

                                        <p>
                                            {analysis.analysisSummary}
                                        </p>

                                    </div>
                                )}


                                {/* ACTIONS */}
                                <div className="history-card-actions">

                                    <button
                                        type="button"
                                        className="history-view-button"
                                        onClick={() =>
                                            onViewAnalysis(
                                                analysis
                                            )
                                        }
                                    >
                                        👁 View Analysis
                                    </button>


                                    <button
                                        type="button"
                                        className="history-delete-button"
                                        onClick={() =>
                                            onDeleteAnalysis(
                                                analysis._id
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
            ) : (
                <div className="analysis-history-empty">

                    <div className="analysis-history-empty-icon">
                        🕘
                    </div>

                    <h3>
                        No Analysis History Yet
                    </h3>

                    <p>
                        Once you analyze a job description,
                        your previous analyses will appear
                        here.
                    </p>

                </div>
            )}
        </section>
    );
}

export default AnalysisHistory;