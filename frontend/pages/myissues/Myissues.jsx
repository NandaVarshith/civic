import React from 'react'
import './Myissues.css'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import CommonHeader from '../../components/CommonHeader'

function MyIssues({ issues }) {
  // Mock data for issues
  const issuesData = issues || [
    { id: '#7565', title: 'Waste Management Overflow', category: 'Garbage', date: '2026-01-27', status: 'In Progress' },
    { id: '#7564', title: 'Streetlight Outage on 5th Ave', category: 'Street Light', date: '2026-01-27', status: 'In Progress' },
    { id: '#7563', title: 'Pothole on Market Street', category: 'Road Damage', date: '2026-01-28', status: 'Resolved' },
    { id: '#7566', title: 'Broken Sidewalk at Central Park', category: 'Road Damage', date: '2026-01-26', status: 'Pending' },
  ];

  return (
    <>
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content myissues-content">
          <CommonHeader title="My Issues" />
          <header className="page-header">
            <div className="header-content">
              <p>Track the status of issues you've reported and see updates from the community.</p>
            </div>
            <div className="header-actions">
              <Link to="/raiseissue" className="btn-primary">Report New Issue</Link>
            </div>
          </header>

          <section className="issues-section">
            <section className="filter-controls">
              <div className="filter-group">
                <select defaultValue="">
                  <option value="" disabled>Category</option>
                  <option>Road Damage</option>
                  <option>Street Light</option>
                  <option>Garbage</option>
                </select>
                <select defaultValue="">
                  <option value="" disabled>Status</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
              <input type="text" placeholder="Search issues..." className="search-input" />
            </section>

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
          </section>
        </main>
      </div>
    </>
  )
}

export default MyIssues
