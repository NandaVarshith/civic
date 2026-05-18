import React, { useEffect, useState } from 'react';
import './Notifications.css';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import CommonHeader from '../../components/CommonHeader';
import axios from 'axios';

const NotificationIcon = ({ type }) => {
  const icons = {
    'Issue created': '📝',
    'Issue Assigned': '👷',
    'Issue Status Updated': '🔄',
    'Issue Resolved': '✅',
    'Issue Closed': '📌',
    default: '🔔',
  };
  return <div className="notification-icon">{icons[type] || icons.default}</div>;
};

const getIssuePath = (roleBase, issueId) => {
  if (!issueId) return roleBase;
  if (roleBase === '/admin') return `${roleBase}/assignissues/${issueId}`;
  if (roleBase === '/worker') return `${roleBase}/issues/${issueId}`;
  return `${roleBase}/myissues`;
};

const getNotificationText = (item, roleBase) => {
  const issueTitle = item?.issue?.title || 'an issue';

  if (roleBase === '/admin') {
    if (item.type === 'Issue created') return `New citizen issue reported: "${issueTitle}".`;
    if (item.type === 'Issue Status Updated') return `Worker updated status for "${issueTitle}".`;
    if (item.type === 'Issue Resolved') return `Worker resolved "${issueTitle}".`;
    if (item.type === 'Issue Closed') return `"${issueTitle}" has been closed.`;
    return item.message || 'New admin notification.';
  }

  if (roleBase === '/worker') {
    if (item.type === 'Issue Assigned') return `You were assigned "${issueTitle}".`;
    if (item.type === 'Issue Status Updated') return `Status changed for "${issueTitle}".`;
    if (item.type === 'Issue Resolved') return `"${issueTitle}" is marked resolved.`;
    if (item.type === 'Issue Closed') return `"${issueTitle}" is now closed.`;
    return item.message || 'New worker notification.';
  }

  if (item.type === 'Issue Status Updated') return `Your issue "${issueTitle}" has a status update.`;
  if (item.type === 'Issue Resolved') return `Your issue "${issueTitle}" is resolved.`;
  if (item.type === 'Issue Closed') return `Your issue "${issueTitle}" has been closed.`;
  if (item.type === 'Issue created') return `Your issue "${issueTitle}" was submitted successfully.`;
  return item.message || 'New user notification.';
};

function Notifications() {
  const location = useLocation();
  const segment = location.pathname.split('/')[1];
  const roleBase = ['user', 'admin', 'worker'].includes(segment) ? `/${segment}` : '/user';

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All');

  const getNotifications = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}api/notifications`, { withCredentials: true });
      const payload = response.data;
      setNotifications(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}api/notifications/mark-all-read`, {}, { withCredentials: true });
      setNotifications((prev) => (Array.isArray(prev) ? prev : []).map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const filteredNotifications = (Array.isArray(notifications) ? notifications : []).filter((n) => {
    if (filter === 'Unread') return !n.isRead;
    return true;
  });

  return (
    <>
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content notifications-content">
          <CommonHeader title="Notifications" />
          <header className="page-header">
            <div className="header-content">
              <p>Updates on your reported issues and community activity.</p>
            </div>
            <div className="header-actions">
              <button className="btn-secondary" onClick={markAllAsRead}>Mark all as read</button>
            </div>
          </header>

          <section className="notifications-container">
            <div className="notification-filters">
              <button onClick={() => setFilter('All')} className={`filter-tab ${filter === 'All' ? 'active' : ''}`}>All</button>
              <button onClick={() => setFilter('Unread')} className={`filter-tab ${filter === 'Unread' ? 'active' : ''}`}>Unread</button>
            </div>

            <div className="notifications-list">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((item) => (
                  <div key={item._id} className={`notification-item ${item.isRead ? '' : 'unread'}`}>
                    <NotificationIcon type={item.type} />
                    <div className="notification-body">
                      <p className="notification-text">
                        {item.issue?._id ? (
                          <Link to={getIssuePath(roleBase, item.issue._id)}>
                            {getNotificationText(item, roleBase)}
                          </Link>
                        ) : (
                          <>{getNotificationText(item, roleBase)}</>
                        )}
                      </p>
                      <span className="notification-timestamp">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                      </span>
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
          </section>
        </main>
      </div>
    </>
  );
}

export default Notifications;
