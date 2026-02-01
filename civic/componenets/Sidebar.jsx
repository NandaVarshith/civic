import React from 'react'
import {Link} from 'react-router-dom'; 

function Sidebar() {
  return (
    <>
    <aside className="sidebar">
            <div className="sidebar-header">
                <h1>UrbanPulse</h1>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li><Link to="/dashboard"><span>&#128202;</span> Dashboard</Link></li>
                    <li><Link to="/myissues"><span>&#128221;</span> My Issues</Link></li>
                    <li><Link to="/raiseissue"><span>&#128195;</span> Raise Issue</Link></li>
                    <li><Link to="/mapview"><span>&#128506;</span> Map View</Link></li>
                    <li><Link to="/analytics" className="active"><span>&#128200;</span> Analytics</Link></li>
                    <li><Link to="/notification"><span>&#128276;</span> Notifications</Link></li>
                    <li><Link to="/profile"><span>&#128100;</span> Profile</Link></li>
                    <li><Link to="/logout"><span>&#128682;</span> Logout</Link></li>
                </ul>
            </nav>
        </aside>
    </>
  )
}

export default Sidebar
