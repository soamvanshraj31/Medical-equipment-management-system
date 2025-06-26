package database

import (
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"medibridge/internal/models"
)

var DB *gorm.DB

func Init() {
	// Initialize PostgreSQL with GORM
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=password dbname=medibridge port=5432 sslmode=disable"
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate tables
	DB.AutoMigrate(&models.Device{}, &models.RepairRequest{}, &models.User{})

	// Seed some sample data if database is empty
	seedSampleData()
}

func seedSampleData() {
	var count int64
	DB.Model(&models.Device{}).Count(&count)
	if count == 0 {
		sampleDevices := []models.Device{
			{
				ID:              "dev-001",
				Name:            "ECG Machine",
				Department:      "Cardiology",
				Status:          "active",
				LastMaintenance: time.Now().AddDate(0, -1, 0),
				NextMaintenance: time.Now().AddDate(0, 1, 0),
				CreatedAt:       time.Now(),
				UpdatedAt:       time.Now(),
			},
			{
				ID:              "dev-002",
				Name:            "X-Ray Machine",
				Department:      "Radiology",
				Status:          "maintenance",
				LastMaintenance: time.Now().AddDate(0, -2, 0),
				NextMaintenance: time.Now().AddDate(0, 0, 7),
				CreatedAt:       time.Now(),
				UpdatedAt:       time.Now(),
			},
			{
				ID:              "dev-003",
				Name:            "Ventilator",
				Department:      "ICU",
				Status:          "active",
				LastMaintenance: time.Now().AddDate(0, -3, 0),
				NextMaintenance: time.Now().AddDate(0, 2, 0),
				CreatedAt:       time.Now(),
				UpdatedAt:       time.Now(),
			},
			{
				ID:              "dev-004",
				Name:            "Blood Analyzer",
				Department:      "Laboratory",
				Status:          "offline",
				LastMaintenance: time.Now().AddDate(0, -1, -15),
				NextMaintenance: time.Now().AddDate(0, 0, 3),
				CreatedAt:       time.Now(),
				UpdatedAt:       time.Now(),
			},
			{
				ID:              "dev-005",
				Name:            "Surgical Robot",
				Department:      "Theatre",
				Status:          "active",
				LastMaintenance: time.Now().AddDate(0, -2, -10),
				NextMaintenance: time.Now().AddDate(0, 1, 15),
				CreatedAt:       time.Now(),
				UpdatedAt:       time.Now(),
			},
		}
		DB.Create(&sampleDevices)
		log.Println("Sample devices seeded successfully")
	}
} 