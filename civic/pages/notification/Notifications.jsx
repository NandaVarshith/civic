import React from 'react'
import './Notifications.css'
import { Link } from 'react-router-dom'
import Sidebar from '../../componenets/Sidebar'
function Notification() {
  return (
    <>
        <div className="dashboard-container">
       
    <Sidebar /> 

        
        <main className="main-content">
            
            <header className="top-header">
                <div className="header-left">
                    <h2>Notifications</h2>
                    <nav className="breadcrumb">
                        <Link to="/dashboard">Dashboard</Link> / <span>Notifications</span>
                    </nav>
                </div>
                <div className="header-right">
                    <div className="user-avatar">
                        <img src="https://i.pravatar.cc/40" alt="User Avatar"/>
                    </div>
                </div>
            </header>

            
            <section className="filters-card">
                <div className="filter-toggles">
                    <button className="toggle-btn active">All</button>
                    <button className="toggle-btn">Unread</button>
                    <button className="toggle-btn">Resolved</button>
                </div>
                <div className="filter-controls">
                    <select id="status-filter" aria-label="Filter by status">
                        <option>Status</option>
                        <option>Pending</option>
                        <option>Assigned</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                        <option>Closed</option>
                    </select>
                    <div className="search-bar">
                        <input type="text" placeholder="Search by title or ID..." aria-label="Search notifications"/>
                    </div>
                </div>
            </section>

            
            <section className="notifications-feed">
                
                <div className="notification-card unread">
                    <div className="notification-content">
                        <h3><Link to="/myissues">Issue #7565: Waste Management Overflow</Link></h3>
                        <p>Your issue has been <strong>assigned to a worker</strong>. You will be notified when progress is made.</p>
                        <div className="notification-meta">
                            <span className="category-badge">Garbage</span>
                            <span className="status-badge assigned">Assigned</span>
                            <span className="timestamp">2 hours ago</span>
                        </div>
                    </div>
                    <div className="notification-right">
                        <div className="notification-image">
                            <img src="https://via.placeholder.com/150/f2f2f2/333?text=Issue+Image" alt="Issue thumbnail"/>
                        </div>
                        <button className="btn-details">View Details</button>
                    </div>
                </div>

                
                <div className="notification-card unread">
                    <div className="notification-content">
                        <h3><Link to="/myissues">Issue #7564: Streetlight Outage</Link></h3>
                        <p>A city worker has updated the status to <strong>In Progress</strong>. The estimated resolution is 2 days.</p>
                        <div className="notification-meta">
                            <span className="category-badge">Street Light</span>
                            <span className="status-badge in-progress">In Progress</span>
                            <span className="timestamp">1 day ago</span>
                        </div>
                    </div>
                     <div className="notification-right">
                        <button className="btn-details">View Details</button>
                    </div>
                </div>

                
                <div className="notification-card read">
                    <div className="notification-content">
                        <h3><Link to="/myissues">Issue #7563: Pothole on Market Street</Link></h3>
                        <p>This issue has been successfully <strong>Resolved</strong>. Thank you for your contribution.</p>
                        <div className="notification-meta">
                            <span className="category-badge">Road Damage</span>
                            <span className="status-badge resolved">Resolved</span>
                            <span className="timestamp">3 days ago</span>
                        </div>
                    </div>
                     <div className="notification-right">
                        <button className="btn-details">View Details</button>
                    </div>
                </div>

                 
                <div className="notification-card read">
                    <div className="notification-content">
                        <h3><Link to="/dashboard">Welcome to UrbanPulse!</Link></h3>
                        <p>You can start by raising an issue or exploring the dashboard. Your reports help improve our city.</p>
                        <div className="notification-meta">
                            <span className="timestamp">1 week ago</span>
                        </div>
                    </div>
                     <div className="notification-right">
                        <button className="btn-details">View Details</button>
                    </div>
                </div>
            </section>
        </main>
    </div>
    </>
  )
}

export default Notification
