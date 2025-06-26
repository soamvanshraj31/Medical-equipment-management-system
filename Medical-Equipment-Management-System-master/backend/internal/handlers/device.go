package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"medibridge/internal/models"
	"medibridge/pkg/database"
	"medibridge/pkg/websocket"
)

func GetDevices(c *gin.Context) {
	var devices []models.Device
	database.DB.Find(&devices)
	c.JSON(200, devices)
}

func CreateDevice(c *gin.Context) {
	var device models.Device
	if err := c.ShouldBindJSON(&device); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	device.ID = generateUUID()
	device.CreatedAt = time.Now()
	device.UpdatedAt = time.Now()

	database.DB.Create(&device)

	// Broadcast update
	websocket.BroadcastUpdate(models.DeviceUpdate{
		DeviceID:   device.ID,
		Status:     device.Status,
		Department: device.Department,
		UpdatedAt:  device.UpdatedAt,
	})

	c.JSON(201, device)
}

func UpdateDevice(c *gin.Context) {
	id := c.Param("id")
	var device models.Device

	if err := database.DB.First(&device, "id = ?", id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Device not found"})
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	updateData["updated_at"] = time.Now()
	database.DB.Model(&device).Updates(updateData)

	// Broadcast update
	websocket.BroadcastUpdate(models.DeviceUpdate{
		DeviceID:   device.ID,
		Status:     device.Status,
		Department: device.Department,
		UpdatedAt:  time.Now(),
	})

	c.JSON(200, device)
}

func DeleteDevice(c *gin.Context) {
	id := c.Param("id")
	var device models.Device

	if err := database.DB.First(&device, "id = ?", id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Device not found"})
		return
	}

	database.DB.Delete(&device)
	c.JSON(200, gin.H{"message": "Device deleted successfully"})
}

func GetDevice(c *gin.Context) {
	id := c.Param("id")
	var device models.Device

	if err := database.DB.First(&device, "id = ?", id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Device not found"})
		return
	}

	c.JSON(200, device)
}

func generateUUID() string {
	return "dev-" + time.Now().Format("20060102150405")
} 