import React from 'react'
import './Mapview.css'
import Sidebar from '../../components/Sidebar'
import CommonHeader from '../../components/CommonHeader'

function Mapview() {
  return (
    <>
        <div className="dashboard-container">
       
        <Sidebar/>

        
        <main className="main-content">
            <CommonHeader title="Map View" />

           
            <section className="map-view-container">
                <div className="map-card">
                   
                    <div className="map-filters">
                        <div className="filter-group">
                            <label htmlFor="status-filter">Status</label>
                            <select id="status-filter">
                                <option>All</option>
                                <option>Pending</option>
                                <option>Assigned</option>
                                <option>In Progress</option>
                                <option>Resolved</option>
                                <option>Closed</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label htmlFor="category-filter">Category</label>
                            <select id="category-filter">
                                <option>All</option>
                                <option>Pothole</option>
                                <option>Streetlight Outage</option>
                                <option>Waste Management</option>
                                <option>Broken Sidewalk</option>
                            </select>
                        </div>
                    </div>
                    
                   
                    <div className="map-placeholder">
                        
                        <div className="map-pin pending" style={{top: '20%', left: '30%'}}>
                            <div className="pin-dot"></div>
                            <div className="pin-popup">
                                <strong>Pothole</strong><br />Status: Pending<br />Category: Road
                            </div>
                        </div>
                        <div className="map-pin assigned" style={{top: '50%', left: '50%'}}>
                            <div className="pin-dot"></div>
                             <div className="pin-popup">
                                <strong>Broken Sidewalk</strong><br />Status: Assigned<br />Category: Infrastructure
                            </div>
                        </div>
                        <div className="map-pin in-progress" style={{top: '65%', left: '25%'}}>
                            <div className="pin-dot"></div>
                             <div className="pin-popup">
                                <strong>Streetlight Outage</strong><br />Status: In Progress<br />Category: Electrical
                            </div>
                        </div>
                        <div className="map-pin resolved" style={{top: '35%', left: '70%'}}>
                            <div className="pin-dot"></div>
                             <div className="pin-popup">
                                <strong>Graffiti</strong><br />Status: Resolved<br />Category: Vandalism
                            </div>
                        </div>
                         <div className="map-pin closed" style={{top: '80%', left: '60%'}}>
                            <div className="pin-dot"></div>
                             <div className="pin-popup">
                                <strong>Waste Management</strong><br />Status: Closed<br />Category: Sanitation
                            </div>
                        </div>
                    </div>

                   
                    <div className="map-legend">
                        <h4>Legend</h4>
                        <ul>
                            <li><span className="legend-dot pending"></span> Pending</li>
                            <li><span className="legend-dot assigned"></span> Assigned</li>
                            <li><span className="legend-dot in-progress"></span> In Progress</li>
                            <li><span className="legend-dot resolved"></span> Resolved</li>
                            <li><span className="legend-dot closed"></span> Closed</li>
                        </ul>
                    </div>

                    
                    <div className="map-controls">
                        <button className="zoom-btn" aria-label="Zoom In">+</button>
                        <button className="zoom-btn" aria-label="Zoom Out">-</button>
                    </div>
                </div>
            </section>
        </main>
    </div>
    </>
  )
}

export default Mapview
