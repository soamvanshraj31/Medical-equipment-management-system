'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { useWebSocket } from '../hooks/useWebSocket'

interface Alert {
  id: string
  type: 'success' | 'warning' | 'error'
  message: string
  timestamp: Date
  deviceId?: string
}

export default function RealTimeAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const { lastMessage } = useWebSocket('ws://localhost:8080/ws/devices')

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data)
      if (data.type === 'device_update' && data.data.alert) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: 'warning',
          message: data.data.alert,
          timestamp: new Date(),
          deviceId: data.data.device_id
        }
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]) // Keep only last 5 alerts
      }
    }
  }, [lastMessage])

  useEffect(() => {
    // Auto-remove alerts after 10 seconds
    const timer = setInterval(() => {
      setAlerts(prev => prev.filter(alert => 
        Date.now() - alert.timestamp.getTime() < 10000
      ))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-success-600" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-warning-600" />
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-danger-600" />
      default:
        return <BellIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getAlertClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200'
      case 'warning':
        return 'bg-warning-50 border-warning-200'
      case 'error':
        return 'bg-danger-50 border-danger-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <BellIcon className="h-6 w-6 text-primary-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Real-time Alerts</h3>
        {alerts.length > 0 && (
          <span className="ml-auto bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
            {alerts.length}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              className={`p-3 border rounded-lg ${getAlertClass(alert.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  {getAlertIcon(alert.type)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.message}
                    </p>
                    {alert.deviceId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Device: {alert.deviceId}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {alerts.length === 0 && (
          <div className="text-center py-8">
            <BellIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No active alerts</p>
            <p className="text-xs text-gray-400 mt-1">All systems operational</p>
          </div>
        )}
      </div>

      {/* Sample alerts for demonstration */}
      {alerts.length === 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Alerts</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
              <span>Device maintenance completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-warning-500 rounded-full mr-2"></div>
              <span>Low inventory alert</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-danger-500 rounded-full mr-2"></div>
              <span>Device offline detected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 