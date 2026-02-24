import React from 'react';
import { FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './CommonHeader.css';

function CommonHeader({ title, extra }) {
  const navigate = useNavigate();

  return (
    <header className="common-header">
      <div className="common-header-title">
        <h2>{title}</h2>
      </div>
      <div className="common-header-right">
        {extra}
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
          <img src="https://i.pravatar.cc/40?u=urbanpulse-user" alt="User avatar" />
        </button>
      </div>
    </header>
  );
}

export default CommonHeader;
