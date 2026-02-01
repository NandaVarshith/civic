import React from 'react'
import './Analytics.css'
import { Link } from 'react-router-dom';
import Sidebar from '../../componenets/Sidebar.jsx';

function Analytics() {
  return (
    <>
        <div className="dashboard-container">
        
        <Sidebar />

        
        <main className="main-content">
           
            <header className="top-header">
                <div className="header-left">
                    <h2>Analytics</h2>
                    <nav className="breadcrumb">
                        <Link to="/dashboard">Dashboard</Link> / <span>Analytics</span>
                    </nav>
                </div>
                <div className="header-right">
                    <div className="user-avatar">
                        <img src="https://i.pravatar.cc/40?u=a042581f4e29026704d" alt="User Avatar"/>
                    </div>
                </div>
            </header>

            
            <div className="analytics-container">
                
                <section className="summary-cards">
                    <div className="card">
                        <div className="card-border-left blue"></div>
                        <div className="card-content">
                            <p className="card-title">Total Issues</p>
                            <p className="card-number">1,250</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-border-left gray"></div>
                        <div className="card-content">
                            <p className="card-title">Pending Issues</p>
                            <p className="card-number">50</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-border-left green"></div>
                        <div className="card-content">
                            <p className="card-title">Resolved Issues</p>
                            <p className="card-number">1,188</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-border-left orange"></div>
                        <div className="card-content">
                            <p className="card-title">Avg. Resolution Time</p>
                            <p className="card-number">3.2 Days</p>
                        </div>
                    </div>
                </section>

                <div className="analytics-grid">
                    
                    <div className="chart-card">
                        <h4>Issue Status</h4>
                        <div className="pie-chart-container">
                            <div className="pie-chart-placeholder"></div>
                            <ul className="chart-legend">
                                <li><span className="legend-dot pending"></span> Pending (15%)</li>
                                <li><span className="legend-dot assigned"></span> Assigned (10%)</li>
                                <li><span className="legend-dot in-progress"></span> In Progress (5%)</li>
                                <li><span className="legend-dot resolved"></span> Resolved (65%)</li>
                                <li><span className="legend-dot closed"></span> Closed (5%)</li>
                            </ul>
                        </div>
                    </div>

                   
                    <div className="chart-card">
                        <h4>Issues by Category</h4>
                        <div className="bar-chart-placeholder">
                            <div className="bar-item" style={{height: '60%'}}><span className="bar-label">Garbage</span></div>
                            <div className="bar-item" style={{height: '80%'}}><span className="bar-label">Road</span></div>
                            <div className="bar-item" style={{height: '50%'}}><span className="bar-label">Light</span></div>
                            <div className="bar-item" style={{height: '30%'}}><span className="bar-label">Water</span></div>
                            <div className="bar-item" style={{height: '45%'}}><span className="bar-label">Drainage</span></div>
                            <div className="bar-item" style={{height: '20%'}}><span className="bar-label">Safety</span></div>
                            <div className="bar-item" style={{height: '15%'}}><span className="bar-label">Other</span></div>
                        </div>
                    </div>

                    
                     <div className="table-card">
                        <h4>Worker Performance</h4>
                         <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Worker Name</th>
                                        <th>Issues Assigned</th>
                                        <th>Issues Completed</th>
                                        <th>Avg. Resolution Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>John Doe</td>
                                        <td>25</td>
                                        <td>22</td>
                                        <td>2.8 Days</td>
                                    </tr>
                                    <tr>
                                        <td>Jane Smith</td>
                                        <td>30</td>
                                        <td>28</td>
                                        <td>2.5 Days</td>
                                    </tr>
                                    <tr>
                                        <td>Mike Johnson</td>
                                        <td>18</td>
                                        <td>15</td>
                                        <td>3.5 Days</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    
                    <div className="chart-card">
                        <h4>Issue Hotspots</h4>
                        <div className="map-placeholder">
                             <div className="heatmap-dot" style={{top: '20%', left: '30%', opacity: 0.8}}></div>
                             <div className="heatmap-dot" style={{top: '25%', left: '35%', opacity: 1}}></div>
                             <div className="heatmap-dot" style={{top: '60%', left: '70%', opacity: 0.9}}></div>
                             <div className="heatmap-dot" style={{top: '55%', left: '65%', opacity: 1}}></div>
                        </div>
                    </div>
                </div>  
            </div>
        </main>
    </div>
    </>
  )
}

export default Analytics
