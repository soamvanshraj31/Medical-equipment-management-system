'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  DeviceTabletIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import { Device, DeviceUpdate, apiClient } from '../lib/api'
import { DEPARTMENTS, STATUS_COLORS } from '../constants/departments'
import { formatDate } from '../utils/date'
import toast from 'react-hot-toast'

interface DeviceGridProps {
  devices: Device[]
  onDeviceUpdate: (update: DeviceUpdate) => void
}

export default function DeviceGrid({ devices, onDeviceUpdate }: DeviceGridProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDevices = devices.filter(device => {
    const matchesDepartment = selectedDepartment === 'all' || device.department === selectedDepartment
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesDepartment && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-success-600" />
      case 'maintenance':
        return <WrenchScrewdriverIcon className="h-5 w-5 text-warning-600" />
      case 'offline':
        return <XCircleIcon className="h-5 w-5 text-danger-600" />
      default:
        return <DeviceTabletIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusClass = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium'
  }

  const handleStatusChange = async (deviceId: string, newStatus: string) => {
    try {
      await apiClient.updateDevice(deviceId, { status: newStatus })
      
      const device = devices.find(d => d.id === deviceId)
      if (device) {
        onDeviceUpdate({
          device_id: deviceId,
          status: newStatus,
          department: device.department,
          updated_at: new Date().toISOString(),
        })
      }
      toast.success(`Device status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating device status:', error)
      toast.error('Error updating device status')
    }
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Device Inventory</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                {getStatusIcon(device.status)}
                <h3 className="ml-2 font-medium text-gray-900 truncate">{device.name}</h3>
              </div>
              <span className={getStatusClass(device.status)}>
                {device.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Department:</span> {device.department}</p>
              <p><span className="font-medium">Last Maintenance:</span></p>
              <p className="text-xs text-gray-500">
                {formatDate(device.last_maintenance)}
              </p>
              <p><span className="font-medium">Next Maintenance:</span></p>
              <p className="text-xs text-gray-500">
                {formatDate(device.next_maintenance)}
              </p>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleStatusChange(device.id, 'active')}
                className={`px-2 py-1 text-xs rounded ${
                  device.status === 'active'
                    ? 'bg-success-100 text-success-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-success-50'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleStatusChange(device.id, 'maintenance')}
                className={`px-2 py-1 text-xs rounded ${
                  device.status === 'maintenance'
                    ? 'bg-warning-100 text-warning-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-warning-50'
                }`}
              >
                Maintenance
              </button>
              <button
                onClick={() => handleStatusChange(device.id, 'offline')}
                className={`px-2 py-1 text-xs rounded ${
                  device.status === 'offline'
                    ? 'bg-danger-100 text-danger-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-danger-50'
                }`}
              >
                Offline
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-8">
          <DeviceTabletIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No devices found</p>
        </div>
      )}
    </div>
  )
} 