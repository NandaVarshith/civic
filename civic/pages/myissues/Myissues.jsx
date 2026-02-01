import React from 'react'
import './Myissues.css'
import { Link } from 'react-router-dom'
import Sidebar from '../../componenets/Sidebar'

function MyIssues() {
  // Mock data for issues
  const issues = [
    { id: '#7565', title: 'Waste Management Overflow', category: 'Garbage', date: '2026-01-27', status: 'In Progress' },
    { id: '#7564', title: 'Streetlight Outage on 5th Ave', category: 'Street Light', date: '2026-01-27', status: 'In Progress' },
    { id: '#7563', title: 'Pothole on Market Street', category: 'Road Damage', date: '2026-01-28', status: 'Resolved' },
    { id: '#7566', title: 'Broken Sidewalk at Central Park', category: 'Road Damage', date: '2026-01-26', status: 'Pending' },
  ];

  // Mock data for summary
  const summary = {
    total: 24,
    pending: 3,
    inProgress: 5,
    resolved: 16,
  };

  return (
    <>
      <div className="my-issues-page">
        <Sidebar />
        <div className="page-content">
          {/* New Page Header */}
          <header className="page-header">
            <div className="header-content">
              <h1>My Reported Issues</h1>
              <p>Track the status of issues you've reported and see updates from the community.</p>
            </div>
            <div className="header-actions">
              <Link to="/raiseissue" className="btn-primary">Report New Issue</Link>
            </div>
          </header>

          {/* New Main Content with 2-column Grid */}
          <main className="main-grid">
            <div className="issues-column">
              {/* Filters */}
              <section className="filter-controls">
                <input type="text" placeholder="Search issues..." className="search-input" />
                <div className="filter-group">
                  <select><option disabled selected>Status</option><option>Pending</option><option>In Progress</option><option>Resolved</option></select>
                  <select><option disabled selected>Category</option><option>Road Damage</option><option>Street Light</option><option>Garbage</option></select>
                </div>
              </section>

              {/* Issue Cards Grid */}
              <div className="issue-cards-grid">
                {issues.map(issue => (
                  <div key={issue.id} className={`issue-card status-${issue.status.toLowerCase().replace(' ', '-')}`}>
                    <div className="issue-card-header">
                      <span className="issue-card-id">{issue.id}</span>
                      <span className={`badge status-${issue.status.toLowerCase().replace(' ', '-')}`}>{issue.status}</span>
                    </div>
                    <div className="issue-card-body">
                      <h3 className="issue-card-title">{issue.title}</h3>
                    </div>
                    <div className="issue-card-footer">
                        <span className="badge category">{issue.category}</span>
                        <span className="issue-card-date">{issue.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="stats-column">
              <h2>Issue Statistics</h2>
              <div className="summary-card-stack">
                <div className="summary-card total">
                    <span className="card-title">Total Issues</span>
                    <span className="card-number">{summary.total}</span>
                </div>
                <div className="summary-card pending">
                    <span className="card-title">Pending</span>
                    <span className="card-number">{summary.pending}</span>
                </div>
                <div className="summary-card in-progress">
                    <span className="card-title">In Progress</span>
                    <span className="card-number">{summary.inProgress}</span>
                </div>
                <div className="summary-card resolved">
                    <span className="card-title">Resolved</span>
                    <span className="card-number">{summary.resolved}</span>
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </>
  )
}

export default MyIssues