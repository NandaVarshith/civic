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

                            {
                                issues.map((issue)=>(
                                    <tr key={issue._id}>
                                        <td>{issue._id}</td>
                                        <td>{issue.category}</td>
                                        <td>{issue.location.address}</td>
                                        <td>{issue.createdAt}</td>
                                        <td><span className={`status-badge ${issue.status.toLowerCase().replace(' ', '-')}`}>{issue.status}</span></td>
                                    </tr>
                                ))
                            }

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
