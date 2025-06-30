import { useState, useEffect } from 'react';
import './DeviceList.css';

const DeviceList = ({ devices, onEditDevice, onDeleteDevice, onStatusChange }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (devices !== null) {
      setLoading(false);
    }
  }, [devices]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return '🟢';
      case 'inactive':
        return '🟡';
      case 'failed':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getStatusTooltip = (status) => {
    switch (status) {
      case 'active':
        return 'Device is operating normally';
      case 'inactive':
        return 'Device is not currently in use';
      case 'failed':
        return 'Power supply issue';
      default:
        return 'Unknown status';
    }
  };

  const getDeviceIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('ventilator')) return '🫁';
    if (n.includes('monitor')) return '🖥️';
    if (n.includes('pump')) return '💧';
    if (n.includes('infusion')) return '💉';
    if (n.includes('defibrillator')) return '⚡';
    if (n.includes('scanner')) return '🖨️';
    if (n.includes('x-ray')) return '🩻';
    return '🔧'; // default icon
  };

  if (loading) {
    return (
      <div className="device-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading devices...</p>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="device-list-empty">
        <p>No devices found. Add your first device to get started!</p>
      </div>
    );
  }

  return (
    <div className="device-list">
      <h3>📋 Device Inventory ({devices.length})</h3>
      <div className="device-grid">
        {devices.map((device) => (
          <div key={device.id} className="device-card">
            <div className="device-header">
              <div className="device-status">
                <span 
                  className="status-indicator" 
                  style={{ backgroundColor: getStatusColor(device.status) }}
                  title={getStatusTooltip(device.status)}
                >
                  {getStatusIcon(device.status)}
                </span>
                <span className="status-text">{device.status}</span>
              </div>
              <div className="device-actions">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => onEditDevice(device)}
                  title="Edit device"
                >
                  ✏️
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => onDeleteDevice(device.id)}
                  title="Delete device"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="device-info">
              <h4 className="device-name">
                <span style={{fontSize: '1.2em', marginRight: 6}}>{getDeviceIcon(device.name)}</span>
                {device.name}
              </h4>
              <p className="device-location">📍 {device.location || 'No location set'}</p>
              <p className="device-id">ID: {device.id}</p>
              <p className="device-updated">
                Last updated: {new Date(device.lastUpdated).toLocaleString()}
              </p>
            </div>

            <div className="device-controls">
              <select 
                value={device.status}
                onChange={(e) => onStatusChange(device.id, e.target.value)}
                className="status-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceList; 