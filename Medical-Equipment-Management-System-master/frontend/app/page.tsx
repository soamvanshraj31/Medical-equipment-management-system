'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DeviceTabletIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import DeviceGrid from './components/DeviceGrid'
import AnalyticsPanel from './components/AnalyticsPanel'
import RealTimeAlerts from './components/RealTimeAlerts'
import { useWebSocket } from './hooks/useWebSocket'
import { apiClient, Device, DeviceUpdate, Analytics } from './lib/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  
  const { lastMessage, connectionStatus } = useWebSocket('ws://localhost:8080/ws/devices')

  useEffect(() => {
    fetchDevices()
    fetchAnalytics()
  }, [])

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data)
      if (data.type === 'initial_data') {
        setDevices(data.data)
        setLoading(false)
      } else if (data.type === 'device_update') {
        handleDeviceUpdate(data.data)
      }
    }
  }, [lastMessage])

  const fetchDevices = async () => {
    try {
      const data = await apiClient.getDevices()
      setDevices(data)
    } catch (error) {
      console.error('Error fetching devices:', error)
      toast.error('Failed to fetch devices')
    }
  }

  const fetchAnalytics = async () => {
    try {
      const [predictive, utilization] = await Promise.all([
        apiClient.getPredictiveAnalytics(),
        apiClient.getDeviceUtilization()
      ])
      setAnalytics({ predictive, utilization })
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to fetch analytics')
    }
  }

  const handleDeviceUpdate = (update: DeviceUpdate) => {
    setDevices(prev => prev.map(device => 
      device.id === update.device_id 
        ? { ...device, status: update.status as Device['status'], updated_at: update.updated_at }
        : device
    ))
  }

  const getStatusCounts = () => {
    const counts = devices.reduce((acc, device) => {
      acc[device.status] = (acc[device.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      active: counts.active || 0,
      maintenance: counts.maintenance || 0,
      offline: counts.offline || 0,
      total: devices.length
    }
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <DeviceTabletIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">MedEquipFlow</h1>
              <span className="ml-3 text-sm text-gray-500">Smart Medical Asset Manager</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center text-sm ${
                connectionStatus === 'Open' ? 'text-success-600' : 'text-danger-600'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  connectionStatus === 'Open' ? 'bg-success-500' : 'bg-danger-500'
                }`}></div>
                {connectionStatus === 'Open' ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Devices</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.active}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.maintenance}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-8 w-8 text-danger-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Offline</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.offline}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Utilization</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.utilization?.utilization_rate || 0}%
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Device Grid */}
          <div className="lg:col-span-2">
            <DeviceGrid devices={devices} onDeviceUpdate={handleDeviceUpdate} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RealTimeAlerts />
            <AnalyticsPanel analytics={analytics} />
          </div>
        </div>
      </div>
    </div>
  )
} 