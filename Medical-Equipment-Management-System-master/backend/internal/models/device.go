package models

import "time"

type Device struct {
	ID              string    `json:"id" gorm:"primaryKey"`
	Name            string    `json:"name"`
	Department      string    `json:"department"`
	Status          string    `json:"status"`
	LastMaintenance time.Time `json:"last_maintenance"`
	NextMaintenance time.Time `json:"next_maintenance"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type DeviceUpdate struct {
	DeviceID   string    `json:"device_id"`
	Status     string    `json:"status"`
	Department string    `json:"department"`
	UpdatedAt  time.Time `json:"updated_at"`
	Alert      string    `json:"alert,omitempty"`
}

type RepairRequest struct {
	ID         string    `json:"id" gorm:"primaryKey"`
	DeviceID   string    `json:"device_id"`
	UserID     string    `json:"user_id"`
	Department string    `json:"department"`
	Request    string    `json:"request"`
	Status     string    `json:"status"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type User struct {
	ID         string    `json:"id" gorm:"primaryKey"`
	Name       string    `json:"name"`
	Email      string    `json:"email"`
	Department string    `json:"department"`
	Role       string    `json:"role"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
} 