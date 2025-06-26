package handlers

import (
	"time"

	"github.com/gin-gonic/gin"
	"medibridge/internal/models"
	"medibridge/pkg/database"
)

func GetPredictiveAnalytics(c *gin.Context) {
	// Get real data from database
	var maintenanceCount int64
	var offlineCount int64
	var totalCount int64

	database.DB.Model(&models.Device{}).Where("status = ?", "maintenance").Count(&maintenanceCount)
	database.DB.Model(&models.Device{}).Where("status = ?", "offline").Count(&offlineCount)
	database.DB.Model(&models.Device{}).Count(&totalCount)

	// Simulate predictive analytics data
	analytics := gin.H{
		"devices_needing_maintenance": int(maintenanceCount),
		"predicted_failures":         int(offlineCount),
		"maintenance_schedule": []gin.H{
			{"device_id": "dev-001", "next_maintenance": time.Now().AddDate(0, 0, 7)},
			{"device_id": "dev-002", "next_maintenance": time.Now().AddDate(0, 0, 14)},
		},
		"accuracy": 95.5,
	}
	c.JSON(200, analytics)
}

func GetDeviceUtilization(c *gin.Context) {
	// Get real data from database
	var activeCount int64
	var maintenanceCount int64
	var offlineCount int64
	var totalCount int64

	database.DB.Model(&models.Device{}).Where("status = ?", "active").Count(&activeCount)
	database.DB.Model(&models.Device{}).Where("status = ?", "maintenance").Count(&maintenanceCount)
	database.DB.Model(&models.Device{}).Where("status = ?", "offline").Count(&offlineCount)
	database.DB.Model(&models.Device{}).Count(&totalCount)

	utilizationRate := 0.0
	if totalCount > 0 {
		utilizationRate = float64(activeCount) / float64(totalCount) * 100
	}

	utilization := gin.H{
		"total_devices":      int(totalCount),
		"active_devices":     int(activeCount),
		"maintenance_devices": int(maintenanceCount),
		"offline_devices":    int(offlineCount),
		"utilization_rate":   utilizationRate,
	}
	c.JSON(200, utilization)
}

func GetDepartments(c *gin.Context) {
	departments := []string{
		"Biomedical Engineering",
		"Laboratory",
		"Theatre",
		"ICU",
		"Pathology",
		"Radiology",
		"Cardiology",
	}
	c.JSON(200, departments)
} 