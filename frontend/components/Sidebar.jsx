import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiGrid, FiFileText, FiPlusSquare, FiMap, FiBarChart2, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
// Assuming sidebar styles are in a global css file, so no local import is needed.

function Sidebar() {
  const location = useLocation();
  const segment = location.pathname.split('/')[1];
  const roleBase = ['user', 'admin', 'worker'].includes(segment) ? `/${segment}` : '/user';

  const navLinks = [
    { to: `${roleBase}/dashboard`, icon: <FiGrid />, label: "Dashboard" },
    { to: `${roleBase}/myissues`, icon: <FiFileText />, label: "My Issues" },
    ...(segment === 'user' ? [{ to: `${roleBase}/raiseissue`, icon: <FiPlusSquare />, label: "Raise Issue" }] : []),
    { to: `${roleBase}/mapview`, icon: <FiMap />, label: "Map View" },
    { to: `${roleBase}/analytics`, icon: <FiBarChart2 />, label: "Analytics" },
    { to: `${roleBase}/notifications`, icon: <FiBell />, label: "Notifications" },
    { to: `${roleBase}/profile`, icon: <FiUser />, label: "Profile" },
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
            <NavLink to={`${roleBase}/logout`} className="nav-link">
                <span className="nav-icon"><FiLogOut /></span>
                <span className="nav-label">Logout</span>
            </NavLink>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
