import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './AlertBanner.css';

const AlertBanner = () => {
  const [alerts, setAlerts] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to Socket.IO server
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Listen for device alerts
    newSocket.on('device-alert', (alert) => {
      console.log('🔔 Received alert:', alert);
      setAlerts(prev => [...prev, alert]);
      
      // Auto-remove alert after 10 seconds
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.timestamp !== alert.timestamp));
      }, 10000);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const removeAlert = (timestamp) => {
    setAlerts(prev => prev.filter(alert => alert.timestamp !== timestamp));
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="alert-container">
      {alerts.map((alert) => (
        <div key={alert.timestamp} className={`alert-banner ${alert.type}`}>
          <div className="alert-content">
            <span className="alert-icon">⚠️</span>
            <div className="alert-text">
              <strong>{alert.message}</strong>
              <div className="alert-details">
                Device: {alert.device.name} | Time: {new Date(alert.timestamp).toLocaleTimeString()}
              </div>
            </div>
            <button 
              className="alert-close"
              onClick={() => removeAlert(alert.timestamp)}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertBanner; 