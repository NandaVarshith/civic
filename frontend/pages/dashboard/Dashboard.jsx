import React from 'react'
import './Dashboard.css'

import Sidebar from '../../components/Sidebar.jsx';
import CommonHeader from '../../components/CommonHeader.jsx';
import Statistics from '../../components/Statistics.jsx';
function Dashboard( {issues} ) {
  return (
    <>
          <div className="dashboard-container">
       
        <Sidebar />

        
        <main className="main-content">
            <CommonHeader
                title="Citizen Dashboard"
                extra={
                    <div className="search-bar">
                        <input type="text" placeholder="Search..." />
                        <button type="button">&#128269;</button>
                    </div>
                }
            />
            <Statistics/>
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
