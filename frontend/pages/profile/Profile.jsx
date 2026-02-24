import React, { useEffect, useState } from 'react';
import './Profile.css';
import Sidebar from '../../components/Sidebar';
import CommonHeader from '../../components/CommonHeader';

const roleMeta = {
  user: {
    label: 'Citizen User',
    accentClass: 'role-user',
    capabilities: ['Report issues', 'Track issue status', 'Receive notifications'],
  },
  worker: {
    label: 'Field Worker',
    accentClass: 'role-worker',
    capabilities: ['View assigned issues', 'Update progress', 'Add field notes'],
  },
  admin: {
    label: 'Platform Admin',
    accentClass: 'role-admin',
    capabilities: ['Manage users', 'Assign workers', 'Monitor analytics'],
  },
};

function Profile() {
  const userData = {
    name: 'Alex Doe',
    email: 'alex.doe@email.com',
    role: 'user',
    phone: '+1 (555) 123-4567',
    profileImage: 'https://i.pravatar.cc/180?u=alex-user',
    isActive: true,
  };
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [profileImageSrc, setProfileImageSrc] = useState(userData.profileImage);
  const roleData = roleMeta[userData.role];

  const handleProfileSave = (event) => {
    event.preventDefault();
  };

  const handleSecuritySave = (event) => {
    event.preventDefault();
  };

  const handleProfileImageChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setUploadedImageFile(selectedFile);
  };

  useEffect(() => {
    if (!uploadedImageFile) {
      setProfileImageSrc(userData.profileImage);
      return undefined;
    }

    const nextObjectUrl = URL.createObjectURL(uploadedImageFile);
    setProfileImageSrc(nextObjectUrl);

    return () => {
      URL.revokeObjectURL(nextObjectUrl);
    };
  }, [uploadedImageFile, userData.profileImage]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content profile-page">
        <CommonHeader title="Profile" />

        <section className={`profile-hero ${roleData.accentClass}`}>
          <div className="hero-left">
            <img src={profileImageSrc} alt={`${userData.name} avatar`} className="profile-avatar" />
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
                  <input id="full-name" defaultValue={userData.name} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" type="email" defaultValue={userData.email} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" type="tel" defaultValue={userData.phone} />
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
                  <input id="current-password" type="password" placeholder="Enter current password" />
                </div>
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <input id="new-password" type="password" placeholder="Enter new password" />
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
