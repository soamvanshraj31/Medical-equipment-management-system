import { useState, useEffect, useCallback } from 'react'
import AlertBanner from './components/AlertBanner'
import DeviceList from './components/DeviceList'
import DeviceForm from './components/DeviceForm'
import DashboardSummary from './components/DashboardSummary'
import SearchBar from './components/SearchBar'
import Navbar from './components/Navbar'
import api from './services/api'
import { io } from 'socket.io-client'
import DashboardAnalytics from './components/DashboardAnalytics'
import './App.css'

const SOCKET_URL = 'http://localhost:3001'

function App() {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDevice, setEditingDevice] = useState(null)
  const [error, setError] = useState('')
  const [socket, setSocket] = useState(null)
  const [search, setSearch] = useState('')

  // Fetch devices from backend
  const fetchDevices = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getDevices()
      setDevices(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch devices')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDevices()
  }, [fetchDevices])

  // Setup Socket.IO for real-time updates
  useEffect(() => {
    const s = io(SOCKET_URL)
    setSocket(s)
    s.on('device-alert', () => {
      fetchDevices() // Refresh device list on alert
    })
    return () => s.close()
  }, [fetchDevices])

  // Add device
  const handleAddDevice = async (formData) => {
    await api.addDevice(formData)
    setShowForm(false)
    fetchDevices()
  }

  // Edit device
  const handleEditDevice = (device) => {
    setEditingDevice(device)
    setShowForm(true)
  }

  // Update device
  const handleUpdateDevice = async (formData) => {
    await api.updateDevice(editingDevice.id, formData)
    setEditingDevice(null)
    setShowForm(false)
    fetchDevices()
  }

  // Delete device
  const handleDeleteDevice = async (id) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      await api.deleteDevice(id)
      fetchDevices()
    }
  }

  // Change device status
  const handleStatusChange = async (id, status) => {
    const device = devices.find((d) => d.id === id)
    if (device) {
      await api.updateDevice(id, { name: device.name, status, location: device.location })
      fetchDevices()
    }
  }

  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false)
    setEditingDevice(null)
  }

  // Search filter
  const filteredDevices = devices.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <Navbar />
      <AlertBanner />
      <div className="app-container">
        <main className="app-main">
          <DashboardSummary devices={devices} />
          <DashboardAnalytics devices={devices} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <SearchBar onSearch={setSearch} />
            <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingDevice(null); }}>
              ➕ Add Device
            </button>
          </div>
          {error && <div className="error-message" style={{ marginBottom: 16 }}>{error}</div>}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
              <p>Loading devices...</p>
            </div>
          ) : (
            <DeviceList
              devices={filteredDevices}
              onEditDevice={handleEditDevice}
              onDeleteDevice={handleDeleteDevice}
              onStatusChange={handleStatusChange}
            />
          )}
        </main>
        {showForm && (
          <DeviceForm
            device={editingDevice}
            isEditing={!!editingDevice}
            onSubmit={editingDevice ? handleUpdateDevice : handleAddDevice}
            onCancel={handleCancelForm}
          />
        )}
      </div>
    </>
  )
}

export default App
