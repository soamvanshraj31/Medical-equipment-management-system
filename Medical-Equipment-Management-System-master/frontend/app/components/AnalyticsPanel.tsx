'use client'

import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Analytics } from '../lib/api'
import { formatDate } from '../utils/date'

interface AnalyticsPanelProps {
  analytics: Analytics | null
}

export default function AnalyticsPanel({ analytics }: AnalyticsPanelProps) {
  if (!analytics) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Predictive Analytics */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card"
      >
        <div className="flex items-center mb-4">
          <ArrowTrendingUpIcon className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Predictive Analytics</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Devices Needing Maintenance</span>
            <span className="text-lg font-semibold text-warning-600">
              {analytics.predictive.devices_needing_maintenance}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Predicted Failures</span>
            <span className="text-lg font-semibold text-danger-600">
              {analytics.predictive.predicted_failures}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Prediction Accuracy</span>
            <span className="text-lg font-semibold text-success-600">
              {analytics.predictive.accuracy}%
            </span>
          </div>

          <div className="mt-4 p-3 bg-primary-50 rounded-lg">
            <h4 className="text-sm font-medium text-primary-800 mb-2">Upcoming Maintenance</h4>
            <div className="space-y-2">
              {analytics.predictive.maintenance_schedule.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="text-primary-700">{item.device_id}</span>
                  <span className="text-primary-600">
                    {formatDate(item.next_maintenance)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Device Utilization */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center mb-4">
          <ChartBarIcon className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Device Utilization</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Devices</span>
            <span className="text-lg font-semibold text-gray-900">
              {analytics.utilization.total_devices}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Active Devices</span>
            <span className="text-lg font-semibold text-success-600">
              {analytics.utilization.active_devices}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">In Maintenance</span>
            <span className="text-lg font-semibold text-warning-600">
              {analytics.utilization.maintenance_devices}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Offline</span>
            <span className="text-lg font-semibold text-danger-600">
              {analytics.utilization.offline_devices}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Utilization Rate</span>
              <span className="text-sm font-semibold text-primary-600">
                {analytics.utilization.utilization_rate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analytics.utilization.utilization_rate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center mb-4">
          <CheckCircleIcon className="h-6 w-6 text-success-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-success-600 mr-2" />
              <span className="text-sm text-success-800">Response Time</span>
            </div>
            <span className="text-sm font-semibold text-success-700">&lt;100ms</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-primary-600 mr-2" />
              <span className="text-sm text-primary-800">Uptime</span>
            </div>
            <span className="text-sm font-semibold text-primary-700">99.9%</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-warning-600 mr-2" />
              <span className="text-sm text-warning-800">Alerts Today</span>
            </div>
            <span className="text-sm font-semibold text-warning-700">3</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 