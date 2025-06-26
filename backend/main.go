package main

import (
	"context"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	"github.com/rs/cors"
	"medibridge/internal/handlers"
	"medibridge/pkg/database"
	"medibridge/pkg/websocket"
)

var rdb *redis.Client

func init() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize database
	database.Init()

	// Initialize Redis
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "localhost:6379"
	}

	rdb = redis.NewClient(&redis.Options{
		Addr:     redisURL,
		Password: "",
		DB:       0,
	})

	// Test Redis connection
	ctx := context.Background()
	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		log.Fatal("Failed to connect to Redis:", err)
	}
}

func setupRoutes(r *gin.Engine) {
	// WebSocket endpoint
	r.GET("/ws/devices", func(c *gin.Context) {
		websocket.HandleWebSocket(c.Writer, c.Request)
	})

	// API routes
	api := r.Group("/api")
	{
		// Device routes
		api.GET("/devices", handlers.GetDevices)
		api.POST("/devices", handlers.CreateDevice)
		api.PUT("/devices/:id", handlers.UpdateDevice)
		api.DELETE("/devices/:id", handlers.DeleteDevice)
		api.GET("/devices/:id", handlers.GetDevice)

		// Analytics routes
		api.GET("/analytics/predictive", handlers.GetPredictiveAnalytics)
		api.GET("/analytics/utilization", handlers.GetDeviceUtilization)
		api.GET("/departments", handlers.GetDepartments)
	}
}

func main() {
	// Start broadcast goroutine
	go websocket.BroadcastUpdates()

	// Set Gin mode
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// CORS middleware
	config := cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	})

	r.Use(func(c *gin.Context) {
		config.HandlerFunc(c.Writer, c.Request)
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	setupRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("MediBridge server starting on port %s", port)
	log.Printf("WebSocket endpoint: ws://localhost:%s/ws/devices", port)
	log.Printf("API endpoint: http://localhost:%s/api", port)
	log.Fatal(r.Run(":" + port))
} 