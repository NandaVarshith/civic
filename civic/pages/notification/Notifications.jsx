import React, { useState } from 'react';
import './Notifications.css';
import { Link } from 'react-router-dom';
import Sidebar from '../../componenets/Sidebar';

// Mock Data
const notificationsData = [
    { id: 1, type: 'assignment', issueId: '#7565', title: 'Waste Management Overflow', message: 'has been assigned to a worker', timestamp: '2 hours ago', unread: true },
    { id: 2, type: 'status_update', issueId: '#7564', title: 'Streetlight Outage', message: 'status updated to In Progress', timestamp: '1 day ago', unread: true },
    { id: 3, type: 'comment', issueId: '#7562', title: 'Graffiti on Wall', message: 'A new comment was added', timestamp: '2 days ago', unread: true },
    { id: 4, type: 'resolution', issueId: '#7563', title: 'Pothole on Market Street', message: 'has been successfully Resolved', timestamp: '3 days ago', unread: false },
    { id: 5, type: 'welcome', message: 'Welcome to UrbanPulse! Your reports help improve our city.', timestamp: '1 week ago', unread: false },
];

// A simple component to render an icon based on notification type
const NotificationIcon = ({ type }) => {
    const icons = {
        assignment: '👤', // User icon for assignment
        status_update: '🔄', // Refresh icon for status change
        comment: '💬', // Speech bubble for comment
        resolution: '✅', // Checkmark for resolved
        welcome: '🎉', // Party popper for welcome
        default: '🔔' // Bell for default
    };
    return <div className="notification-icon">{icons[type] || icons.default}</div>;
};

function Notification() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState('All');

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(n => ({ ...n, unread: false }))
    );
  };
  
  const filteredNotifications = notifications.filter(n => {
      if (filter === 'Unread') return n.unread;
      return true;
  });

  return (
    <>
      <div className="notifications-page">
        <Sidebar />
        <div className="page-content">
          <header className="page-header">
            <div className="header-content">
              <h1>Notifications</h1>
              <p>Updates on your reported issues and community activity.</p>
            </div>
            <div className="header-actions">
              <button className="btn-secondary" onClick={markAllAsRead}>Mark all as read</button>
            </div>
          </header>

          <main className="notifications-container">
            <div className="notification-filters">
              <button onClick={() => setFilter('All')} className={`filter-tab ${filter === 'All' ? 'active' : ''}`}>All</button>
              <button onClick={() => setFilter('Unread')} className={`filter-tab ${filter === 'Unread' ? 'active' : ''}`}>Unread</button>
            </div>

            <div className="notifications-list">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(item => (
                  <div key={item.id} className={`notification-item ${item.unread ? 'unread' : ''}`}>
                    <NotificationIcon type={item.type} />
                    <div className="notification-body">
                      <p className="notification-text">
                        {item.issueId ? (
                            <>Your issue <Link to="/myissues">{item.issueId}: {item.title}</Link> {item.message}.</>
                        ) : (
                           <>{item.message}</>
                        )}
                      </p>
                      <span className="notification-timestamp">{item.timestamp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                    <h3>No new notifications</h3>
                    <p>It looks like you're all caught up!</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default Notification;
