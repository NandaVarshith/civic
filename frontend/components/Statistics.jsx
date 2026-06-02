import React, { useMemo } from 'react'


function Statistics({ issues = [] }) {

    const statistics = useMemo(() => {
        const safeIssues = Array.isArray(issues) ? issues : [];

        return {
            totalIssues: safeIssues.length,
            pendingIssues: safeIssues.filter((issue) => issue.status === "Pending").length,
            inProgressIssues: safeIssues.filter((issue) => issue.status === "In Progress").length,
            resolvedIssues: safeIssues.filter((issue) => issue.status === "Resolved").length
        };
    }, [issues]);

  return (
    <>
                <section className="summary-cards">
                <div className="card">
                    <div className="card-border-left blue"></div>
                    <div className="card-content">
                        <p className="card-title">Total Issues</p>
                        <p className="card-number">{statistics.totalIssues}</p>
                        <p className="card-subtitle">All time</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-border-left gray"></div>
                    <div className="card-content">
                        <p className="card-title">Pending Issues</p>
                        <p className="card-number">{statistics.pendingIssues}</p>
                        <p className="card-subtitle">Awaiting action</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-border-left orange"></div>
                    <div className="card-content">
                        <p className="card-title">In Progress</p>
                        <p className="card-number">{statistics.inProgressIssues}</p>
                        <p className="card-subtitle">Currently being worked on</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-border-left green"></div>
                    <div className="card-content">
                        <p className="card-title">Resolved</p>
                        <p className="card-number">{statistics.resolvedIssues}</p>
                        <p className="card-subtitle">Completed and closed</p>
                    </div>
                </div>
            </section>
      
    </>
  )
}

export default Statistics
