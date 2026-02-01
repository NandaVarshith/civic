import React from 'react'
import './Profile.css'
import {Link} from 'react-router-dom';  
import Sidebar from '../../componenets/Sidebar';  
function Profile() {
  return (
    <>
        <div className="dashboard-container">
       
        <Sidebar /> 

        
        <main className="main-content">
            
            <header className="top-header">
                <div className="header-left">
                    <h2>Profile</h2>
                    <nav className="breadcrumb">
                        <a href="dashboard.html">Dashboard</a> / <span>Profile</span>
                    </nav>
                </div>
                <div className="header-right">
                    <div className="user-avatar">
                        <img src="https://i.pravatar.cc/40?u=a042581f4e29026704d" alt="User Avatar"/>
                    </div>
                </div>
            </header>

            
            <div className="profile-container">
                
                <section className="profile-header-card">
                    <div className="profile-avatar">
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile Picture"/>
                    </div>
                    <div className="profile-summary">
                        <h3 className="profile-name">Alex Doe</h3>
                        <p className="profile-role">Citizen</p>
                        <p className="profile-joindate">Member since Jan 15, 2025</p>
                    </div>
                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-number">18</span>
                            <span className="stat-label">Issues Submitted</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">12</span>
                            <span className="stat-label">Issues Resolved</span>
                        </div>
                    </div>
                </section>

                
                <section className="profile-details-card">
                    <div className="card-header">
                        <h4>Personal Information</h4>
                        <button className="btn-edit">Edit</button>
                    </div>
                    <div className="card-content">
                        <form action="#" method="POST">
                            <div className="form-row">
                                <div className="form-group">
                                    <label for="full-name">Full Name <span className="required-star">*</span></label>
                                    <input type="text" id="full-name" value="Alex Doe" required />
                                </div>
                                <div className="form-group">
                                    <label for="email">Email Address <span className="required-star">*</span></label>
                                    <input type="email" id="email" value="alex.doe@email.com" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="tel" id="phone" value="+1 (555) 123-4567" />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">Save Information</button>
                            </div>
                        </form>
                    </div>
                </section>

                
                <section className="profile-security-card">
                    <div className="card-header">
                        <h4>Password & Security</h4>
                    </div>
                     <div className="card-content">
                        <form action="#" method="POST">
                            <div className="form-group">
                                <label for="old-password">Old Password</label>
                                <input type="password" id="old-password" placeholder="Enter your old password"/>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label for="new-password">New Password</label>
                                    <input type="password" id="new-password" placeholder="Enter a new password"/>
                                </div>
                                <div className="form-group">
                                    <label for="confirm-password">Confirm New Password</label>
                                    <input type="password" id="confirm-password" placeholder="Confirm your new password"/>
                                </div>
                            </div>
                             <div className="form-actions">
                                <button type="submit" className="btn-primary">Update Password</button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    </div>
    </>
  )
}

export default Profile
