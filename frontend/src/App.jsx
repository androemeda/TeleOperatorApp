// App.jsx
import React, { useState, useEffect } from 'react';
import { CameraView } from './components/CameraView';
import { PointCloudViewer } from './components/PointCloudViewer';
import { Metrics } from './components/Metrics';
import { Controls } from './components/Controls';
import './App.css'; // Import the custom CSS

const App = () => {
  const [metrics, setMetrics] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:5000/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    const interval = setInterval(fetchMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRecording = async () => {
    try {
      const endpoint = isRecording ? '/stop_recording' : '/start_recording';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        setIsRecording(!isRecording);
      }
    } catch (error) {
      console.error('Error toggling recording:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="header">Teleoperator Interface</h1>
      
      <div className="grid-container">
        <div className="grid-item space-y-4">
          <CameraView />
          <Metrics metrics={metrics} />
          <Controls 
            isRecording={isRecording} 
            onRecordingToggle={handleRecording} 
          />
        </div>
        <div className="grid-item card">
          <PointCloudViewer />
        </div>
      </div>
    </div>
  );
};

export default App;
