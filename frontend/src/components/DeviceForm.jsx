import { useState, useEffect } from 'react';
import './DeviceForm.css';

const DeviceForm = ({ device, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (device && isEditing) {
      setFormData({
        name: device.name,
        status: device.status,
        location: device.location || ''
      });
    }
  }, [device, isEditing]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Device name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Device name must be at least 2 characters';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      if (!isEditing) {
        setFormData({ name: '', status: 'active', location: '' });
      }
    } catch (error) {
      console.error('Error submitting device:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="device-form-container">
      <div className="device-form">
        <h3>{isEditing ? '✏️ Edit Device' : '➕ Add New Device'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Device Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter device name (e.g., Ventilator-001)"
              className={errors.name ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={errors.status ? 'error' : ''}
              disabled={isSubmitting}
            >
              <option value="active">🟢 Active</option>
              <option value="inactive">🟡 Inactive</option>
              <option value="failed">🔴 Failed</option>
            </select>
            {errors.status && <span className="error-message">{errors.status}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location (e.g., ICU, Ward-2, ER Bay A)"
              className={errors.location ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  {isEditing ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditing ? 'Update Device' : 'Add Device'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceForm; 