import React, { useEffect, useState } from 'react';
import './Profile.css';
import Sidebar from '../../components/Sidebar';
import CommonHeader from '../../components/CommonHeader';
import axios from 'axios';

// It's good practice to define constants outside the component if they don't depend on props or state.
const ROLES_CONFIG = {
  user: {
    label: 'User',
    accentClass: 'accent-user',
    capabilities: ['Raise new issues', 'View own issues', 'Receive notifications'],
  },
  worker: {
    label: 'Worker',
    accentClass: 'accent-worker',
    capabilities: ['View assigned issues', 'Update issue status', 'View map'],
  },
  admin: {
    label: 'Administrator',
    accentClass: 'accent-admin',
    capabilities: ['Manage users', 'View all issues', 'System analytics'],
  },
};

function Profile() {
  const [userData, setUserData] = useState({
    name: 'Alex Doe',
    email: 'alex.doe@email.com',
    role: 'user',
    phone: '+1 (555) 123-4567',
    profileImage: 'https://i.pravatar.cc/180?u=alex-user',
    isActive: true,
  });
  
  const getUserData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}api/user`, { withCredentials: true });
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Derive role-specific data from userData using useMemo for performance
  const roleData = React.useMemo(() => {
    return ROLES_CONFIG[userData.role] || ROLES_CONFIG.user;
  }, [userData.role]);

  // --- Event Handlers ---

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const keyMap = {
      'full-name': 'name',
      'email': 'email',
      'phone': 'phone',
    };
    const stateKey = keyMap[id];
    if (stateKey) {
      setUserData(prev => ({ ...prev, [stateKey]: value }));
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}api/user/updateprofile`, {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        profileImage: userData.profileImage,
      }, { withCredentials: true });
      console.log('Profile update response:', response);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleProfileImageChange = (e) => {
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUserData((prev) => ({ ...prev, profileImage: reader.result }));
    };

    reader.readAsDataURL(file);
  };

  const handleSecuritySave = async (e) => {
    e.preventDefault();
    console.log('Updating password...');
    try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}api/user/password`, {
      oldPassword: password.current,
      newPassword: password.new,
    }, { withCredentials: true });
    console.log('Password update response:', response);
    setPassword({ current: '', new: '' }); // Clear password fields after update
  } catch (error) {
    console.error('Failed to update password:', error);
  }
  };

  const [password, setPassword] = useState({
    current: '',
    new: '',
  });



  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content profile-page">
        <CommonHeader title="Profile" />
        <section className={`profile-hero ${roleData.accentClass}`}>
          <div className="hero-left">
            <img src={userData.profileImage} alt={`${userData.name} avatar`} className="profile-avatar" />
            <div className="hero-identity">
              <h3>{userData.name}</h3>
              <p>{userData.email}</p>
              <div className="identity-chips">
                <span className={`role-chip ${roleData.accentClass}`}>{roleData.label}</span>
                <span className={`status-chip ${userData.isActive ? 'active' : 'inactive'}`}>
                  {userData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <span className="meta-label">Account Role</span>
            <p className="fixed-role-text">{roleData.label}</p>
          </div>
        </section>
        <div className="profile-content-grid">
          <section className="profile-card">
            <div className="card-head">
              <h4>Personal Information</h4>
              <button type="button" className="btn-ghost">Edit</button>
            </div>
            <form className="card-body" onSubmit={handleProfileSave}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="full-name">Full Name</label>
                  <input id="full-name" value={userData.name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" type="email" value={userData.email} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" type="tel" value={userData.phone} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-image">Profile Image</label>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </section>
          <aside className="profile-side-column">
            <section className="profile-card">
              <div className="card-head">
                <h4>Role Access</h4>
              </div>
              <div className="card-body">
                <p className="card-muted">This platform supports User, Worker, and Admin profiles.</p>
                <ul className="capability-list">
                  {roleData.capabilities.map((capability) => (
                    <li key={capability}>{capability}</li>
                  ))}
                </ul>
              </div>
            </section>
            <section className="profile-card">
              <div className="card-head">
                <h4>Security</h4>
              </div>
              <form className="card-body" onSubmit={handleSecuritySave}>
                <div className="form-group">
                  <label htmlFor="current-password">Current Password</label>
                  <input id="current-password" type="password"  value={password.current} onChange={(e) => setPassword({ ...password, current: e.target.value })} placeholder="Enter current password" />
                </div>
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <input id="new-password" type="password" value={password.new} onChange={(e) => setPassword({ ...password, new: e.target.value })} placeholder="Enter new password" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Update Password</button>
                </div>
              </form>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Profile;
