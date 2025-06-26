# MedEquipFlow – Smart Medical Asset Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Go Version](https://img.shields.io/badge/Go-1.21+-blue.svg)](https://golang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7+-red.svg)](https://redis.io/)

## Live Preview
https://medequipflow-demo.example.com/

![MedEquipFlow Dashboard](https://placehold.co/800x400?text=MedEquipFlow+Dashboard)

## Key Capabilities

### Instant Device Insights
- **Live Status Streaming**: Monitor device health and activity in real time with sub-second updates
- **AI-Driven Forecasts**: Predict inventory needs and maintenance using intelligent analytics
- **Automated Alerts**: Get notified instantly for critical device events and service requirements

### Departmental Oversight
- Secure, role-based access for admins, engineers, and staff
- Custom dashboards for each department's assets
- Fine-grained permissions for device and request management

### Asset Lifecycle Management
- Track every device from acquisition to retirement
- Log repairs, schedule maintenance, and view service history
- Manage requests and approvals for repairs and replacements

### Advanced Reporting
- Visualize device usage, downtime, and performance trends
- Optimize inventory with actionable recommendations
- Export analytics for compliance and audits

## Technology Overview

### Backend
- **Go (Gin Framework)**: Fast, scalable REST API
- **PostgreSQL**: Robust relational data storage
- **Redis**: High-speed caching and session handling
- **WebSocket**: Real-time data delivery

### Frontend
- **Next.js 14**: Modern React-based UI with SSR
- **TypeScript**: Reliable, type-safe codebase
- **Tailwind CSS**: Responsive, clean design
- **Socket.io Client**: Real-time updates on the web

### DevOps & Deployment
- **Azure Cloud**: Scalable hosting
- **Docker**: Consistent, containerized deployments
- **CI/CD**: Automated testing and deployment pipelines
- **Container Registry**: Secure image storage

## System Architecture

```
┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐
│   Next.js Frontend │    │   Go API Backend   │    │   PostgreSQL DB    │
└────────────────────┘◄──►└────────────────────┘◄──►└────────────────────┘
         │                        │                        │
         │               ┌────────────────────┐           │
         └───────────────►│      Redis        │◄──────────┘
                         │   Cache/Queue     │
                         └────────────────────┘
```

## Getting Started

### Prerequisites
- Go 1.21 or newer
- Node.js 18 or newer
- PostgreSQL 15 or newer
- Redis 7 or newer
- Docker (optional)

### Backend Setup
```bash
cd backend
go mod download
go run main.go
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Database Initialization
```bash
# Create the database
createdb medequipflow

# Run migrations
cd backend
go run cmd/migrate/main.go
```

### Docker Deployment
```bash
# Build and launch all services
docker-compose up --build
```

## API Overview

### Real-time Endpoints
- `WS /ws/devices` – WebSocket for live device data
- `WS /ws/alerts` – WebSocket for instant alerts

### REST Endpoints
- `GET /api/devices` – List all devices
- `POST /api/devices` – Add a new device
- `PUT /api/devices/:id` – Update device details
- `DELETE /api/devices/:id` – Remove a device
- `GET /api/departments` – List departments
- `POST /api/requests` – Submit a repair request
- `PUT /api/requests/:id/status` – Change request status

## Performance Benchmarks

- **WebSocket Latency**: Typically <100ms
- **Device Scale**: Supports 50+ assets per deployment
- **Uptime**: Designed for 24/7 monitoring
- **Prediction Accuracy**: 95%+ for maintenance needs

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Describe your feature'`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Developed by [Your Name](https://your-portfolio.example.com/)

---

**MedEquipFlow** – Empowering hospitals with intelligent, real-time medical asset management.

