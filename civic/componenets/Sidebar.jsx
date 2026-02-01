import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiFileText, FiPlusSquare, FiMap, FiBarChart2, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
// Assuming sidebar styles are in a global css file, so no local import is needed.

function Sidebar() {
  const navLinks = [
    { to: "/dashboard", icon: <FiGrid />, label: "Dashboard" },
    { to: "/myissues", icon: <FiFileText />, label: "My Issues" },
    { to: "/raiseissue", icon: <FiPlusSquare />, label: "Raise Issue" },
    { to: "/mapview", icon: <FiMap />, label: "Map View" },
    { to: "/analytics", icon: <FiBarChart2 />, label: "Analytics" },
    { to: "/notification", icon: <FiBell />, label: "Notifications" },
    { to: "/profile", icon: <FiUser />, label: "Profile" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>UrbanPulse</h1>
      </div>
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink 
                  to={link.to}
                  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-label">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
            <NavLink to="/logout" className="nav-link">
                <span className="nav-icon"><FiLogOut /></span>
                <span className="nav-label">Logout</span>
            </NavLink>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
