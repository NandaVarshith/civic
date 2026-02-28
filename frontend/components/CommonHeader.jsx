import React, { useState, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CommonHeader.css';

function CommonHeader({ title}) {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        // There was a typo in the environment variable (VITE_API_UR)
        // Also, using await consistently is cleaner than mixing with .then()
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/user`, { withCredentials: true });
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    getUserData();
  }, []); // The empty dependency array ensures this runs only once on mount.

  return (
    <header className="common-header">
      <div className="common-header-title">
        <h2>{title}</h2>
      </div>
      <div className="common-header-right">
        
        <button
          type="button"
          className="header-icon-button"
          aria-label="Open notifications"
          onClick={() => navigate('/notifications')}
        >
          <FiBell />
        </button>
        <button
          type="button"
          className="header-avatar-button"
          aria-label="Open profile"
          onClick={() => navigate('/profile')}
        >
          {userData && <img src={userData.profileImage} alt="User avatar" />}
        </button>
      </div>
    </header>
  );
}

export default CommonHeader;
