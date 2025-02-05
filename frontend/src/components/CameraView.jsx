// components/CameraView.jsx
import React from 'react';
import './CameraView.css'; // Import the custom CSS

export const CameraView = () => {
  return (
    <div className="camera-container">
      <h2 className="camera-title">Camera Feed</h2>
      <div className="camera-feed">
        <img
          src="http://localhost:5000/video_feed"
          alt="Camera Feed"
        />
      </div>
    </div>
  );
};
