import React, { useEffect , useState } from 'react';
import './Notifications.css';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import CommonHeader from '../../components/CommonHeader';
import axios from 'axios';


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

function Notifications() {

  const [notifications, setNotifications] = useState([]);

  const getNotifications = async() => {
    try {
      const response = await axios.get('api/notifications', { withCredentials: true });
      const payload = response.data;
      setNotifications(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(()=>{
    getNotifications();
  }, []);

  const [filter, setFilter] = useState('All');

  const markAllAsRead = () => {
    setNotifications(
      (Array.isArray(notifications) ? notifications : []).map(n => ({ ...n, isRead: true }))
    );
  };
  
  const filteredNotifications = (Array.isArray(notifications) ? notifications : []).filter(n => {
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
              {
              filteredNotifications.length > 0 ? (
                filteredNotifications.map(item => (
                  <div key={item._id} className={`notification-item ${item.isRead ? '' : 'unread'}`}>
                    <NotificationIcon type={item.type} />
                    <div className="notification-body">
                      <p className="notification-text">
                        {item.issue?._id ? (
                            <>Your issue <Link to="/myissues">{item.issue._id}: {item.issue.title}</Link> {item.message}.</>
                        ) : (
                           <>{item.message}</>
                        )}
                      </p>
                      <span className="notification-timestamp">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</span>
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
  )
}

export default Notifications;
