import React from 'react'
import './myissues.css'
import {Link} from 'react-router-dom';
import Sidebar from '../../componenets/Sidebar';

function MyIssues() {
  return (
    <>
        <div className="dashboard-container">
        
        <Sidebar />

        <div className="page-wrapper">
            
            <header className="top-header">
                <h1 style={{color: '#3a7bd5'}}>My Reported Issues</h1>
                <div className="user-profile">
                    <div className="avatar"></div>
                    <span>Admin User</span>
                </div>
            </header>

            
            <main className="main-content">
                <nav className="breadcrumb"><Link to="/dashboard">Dashboard</Link> / My Issues</nav>

              
                <section className="summary-cards">
                    <div className="card total"><div className="card-title">Total Issues</div><div className="card-number">24</div></div>
                    <div className="card pending"><div className="card-title">Pending</div><div className="card-number">3</div></div>
                    <div className="card in-progress"><div className="card-title">In Progress</div><div className="card-number">5</div></div>
                    <div className="card resolved"><div className="card-title">Resolved</div><div className="card-number">16</div></div>
                </section>

                
                <section className="controls-card">
                    <div className="search-box">
                        <input type="text" placeholder="Search by title or issue ID..." />
                    </div>
                    <select><option disabled selected>Status</option><option>Pending</option><option>In Progress</option><option>Resolved</option></select>
                    <select><option disabled selected>Category</option><option>Road Damage</option><option>Street Light</option><option>Garbage</option></select>
                    
                </section>

                
                <section className="issues-list-container">
                    <table className="issues-table">
                        <thead>
                            <tr>
                                <th>Issue ID</th><th>Title</th><th>Category</th><th>Date</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="Issue ID">#7565</td>
                                <td data-label="Title" className="issue-title">Waste Management Overflow</td>
                                <td data-label="Category"><span className="badge category">Garbage</span></td>
                                <td data-label="Date">2026-01-27</td>
                                <td data-label="Status"><span className="badge status-in-progress">In Progress</span></td>
                                <td data-label="Actions" className="action-buttons">
                                    <button>View Details</button>
                                </td>
                            </tr>
                            <tr>
                                <td data-label="Issue ID">#7564</td>
                                <td data-label="Title" className="issue-title">Streetlight Outage on 5th Ave</td>
                                <td data-label="Category"><span className="badge category">Street Light</span></td>
                                <td data-label="Date">2026-01-27</td>
                                <td data-label="Status"><span className="badge status-in-progress">In Progress</span></td>
                                <td data-label="Actions" className="action-buttons">
                                    <button>View Details</button>
                                </td>
                            </tr>
                            <tr>
                                <td data-label="Issue ID">#7563</td>
                                <td data-label="Title" className="issue-title">Pothole on Market Street</td>
                                <td data-label="Category"><span className="badge category">Road Damage</span></td>
                                <td data-label="Date">2026-01-28</td>
                                <td data-label="Status"><span className="badge status-resolved">Resolved</span></td>
                                <td data-label="Actions" className="action-buttons">
                                    <button>View Details</button>
                                </td>
                            </tr>
                             <tr>
                                <td data-label="Issue ID">#7566</td>
                                <td data-label="Title" className="issue-title">Broken Sidewalk at Central Park</td>
                                <td data-label="Category"><span className="badge category">Road Damage</span></td>
                                <td data-label="Date">2026-01-26</td>
                                <td data-label="Status"><span className="badge status-pending">Pending</span></td>
                                <td data-label="Actions" className="action-buttons">
                                    <button>View Details</button>
                                </td>
                                
                            </tr>
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    </div>
    </>
  )
}

export default MyIssues