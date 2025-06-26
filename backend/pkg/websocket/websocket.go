package websocket

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"medibridge/internal/models"
	"medibridge/pkg/database"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // Allow all origins for development
		},
	}
	clients   = make(map[*websocket.Conn]bool)
	broadcast = make(chan models.DeviceUpdate)
)

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade failed: %v", err)
		return
	}
	defer conn.Close()

	clients[conn] = true

	// Send initial device data
	var devices []models.Device
	database.DB.Find(&devices)
	conn.WriteJSON(gin.H{
		"type": "initial_data",
		"data": devices,
	})

	for {
		var msg map[string]interface{}
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Printf("WebSocket read error: %v", err)
			delete(clients, conn)
			break
		}

		// Handle different message types
		if msgType, ok := msg["type"].(string); ok {
			switch msgType {
			case "ping":
				conn.WriteJSON(gin.H{"type": "pong"})
			}
		}
	}
}

func BroadcastUpdates() {
	for {
		update := <-broadcast
		for client := range clients {
			err := client.WriteJSON(gin.H{
				"type": "device_update",
				"data": update,
			})
			if err != nil {
				log.Printf("WebSocket write error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func BroadcastUpdate(update models.DeviceUpdate) {
	broadcast <- update
} 