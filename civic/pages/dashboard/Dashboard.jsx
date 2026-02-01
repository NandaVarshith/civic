import React from 'react'
import './Dashboard.css'
import { useNavigate ,Link } from 'react-router-dom';

import Sidebar from '../../components/Sidebar.jsx';
function Dashboard() {
    
    const navigate = useNavigate();

  return (
    <>
          <div className="dashboard-container">
       
        <Sidebar />

        
        <main className="main-content">
           
            <header className="top-navbar">
                <div className="navbar-title">
                    <h2>Citizen Dashboard</h2>
                </div>
                <div className="navbar-right">
                    <div className="search-bar">
                        <input type="text" placeholder="Search..."/>
                        <button>&#128269;</button>
                    </div>
                    <div className="notification-bell">
                        <span onClick={() => navigate('/notifications')} className="notification-icon">&#128276;</span>
                    </div>
                    <div onClick={() => navigate('/profile')} className="user-avatar">
                        <img src="https://i.pravatar.cc/40" alt="User Avatar"/>
                    </div>
                </div>
            </header>

            
            <section className="summary-cards">
                <div className="card">
                    <div className="card-border-left blue"></div>
                    <div className="card-content">
                        <p className="card-title">Total Issues</p>
                        <p className="card-number">1,250</p>
                        <p className="card-subtitle">All time</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-border-left gray"></div>
                    <div className="card-content">
                        <p className="card-title">Pending Issues</p>
                        <p className="card-number">50</p>
                        <p className="card-subtitle">Awaiting action</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-border-left orange"></div>
                    <div className="card-content">
                        <p className="card-title">In Progress</p>
                        <p className="card-number">12</p>
                        <p className="card-subtitle">Currently being worked on</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-border-left green"></div>
                    <div className="card-content">
                        <p className="card-title">Resolved</p>
                        <p className="card-number">1,188</p>
                        <p className="card-subtitle">Completed and closed</p>
                    </div>
                </div>
            </section>

            
            <section className="recent-issues">
                <h2>Recent Issues</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Issue ID</th>
                                <th>Issue Type</th>
                                <th>Area</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#7563</td>
                                <td>Pothole</td>
                                <td>Downtown</td>
                                <td>2026-01-28</td>
                                <td><span className="status-badge resolved">Resolved</span></td>
                            </tr>
                            <tr>
                                <td>#7564</td>
                                <td>Streetlight Outage</td>
                                <td>North Park</td>
                                <td>2026-01-27</td>
                                <td><span className="status-badge in-progress">In Progress</span></td>
                            </tr>
                            <tr>
                                <td>#7565</td>
                                <td>Waste Management</td>
                                <td>Eastside</td>
                                <td>2026-01-27</td>
                                <td><span className="status-badge assigned">Assigned</span></td>
                            </tr>
                            <tr>
                                <td>#7566</td>
                                <td>Broken Sidewalk</td>
                                <td>Uptown</td>
                                <td>2026-01-26</td>
                                <td><span className="status-badge pending">Pending</span></td>
                            </tr>
                             <tr>
                                <td>#7567</td>
                                <td>Graffiti</td>
                                <td>West End</td>
                                <td>2026-01-25</td>
                                <td><span className="status-badge resolved">Resolved</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
    </>
  )
}


export default Dashboard
