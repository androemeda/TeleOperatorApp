// components/Metrics.jsx
import React from 'react';
import './Metrics.css'; // Import the custom CSS

export const Metrics = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="metrics-container">
      <h2 className="metrics-title">Stream Metrics</h2>
      <div className="metrics-grid">
        <div className="metrics-item">
          <p className="metrics-label">FPS</p>
          <p className="metrics-value">{metrics.fps}</p>
        </div>
        <div className="metrics-item">
          <p className="metrics-label">Resolution</p>
          <p className="metrics-value">{metrics.resolution}</p>
        </div>
      </div>
    </div>
  );
};
