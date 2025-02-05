// components/Controls.jsx
import React from 'react';
import './Controls.css'; // Import the custom CSS

export const Controls = ({ isRecording, onRecordingToggle }) => {
  return (
    <div className="controls-container">
      <h2 className="controls-title">Controls</h2>
      <button
        onClick={onRecordingToggle}
        className={`controls-button ${
          isRecording
            ? 'controls-button-recording'
            : 'controls-button-not-recording'
        }`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};
