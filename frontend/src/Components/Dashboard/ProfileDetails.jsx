import React from 'react';
import { useUser } from '../../context/UserContext';

const ProfileDetails = () => {
  const { user } = useUser();

  return (
    <div className="profile-details">
      <h2>Profile Details</h2>
      
      <div className="profile-section">
        <div className="profile-image-container">
          {user?.profileImage ? (
            <img 
              src={`http://localhost:8081/uploads/${user.profileImage}`} 
              alt="Profile"
              className="large-profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/default-profile.png';
              }}
            />
          ) : (
            <div className="profile-image-placeholder">
              <i className="fas fa-user-circle"></i>
            </div>
          )}
          <button className="change-photo-btn">
            <i className="fas fa-camera"></i> Change Photo
          </button>
        </div>
        
        <div className="profile-info">
          <div className="info-row">
            <label>Username:</label>
            <div className="info-value">{user?.username || 'N/A'}</div>
          </div>
          
          <div className="info-row">
            <label>Email:</label>
            <div className="info-value">{user?.email || 'N/A'}</div>
          </div>
          
          <div className="info-row">
            <label>Password:</label>
            <div className="info-value">
              ••••••••
              <button className="change-password-btn">
                Change Password
              </button>
            </div>
          </div>
          
          <div className="info-actions">
            <button className="edit-profile-btn">
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;