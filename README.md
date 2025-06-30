# MediBridge

A modern healthcare platform connecting medical devices and healthcare providers through a robust microservices architecture with real-time alerts.

## 🏗️ Project Structure

```
MediBridge/
├── backend/
│   └── device-service/     # Microservice for device management
├── frontend/              # Web application interface
├── infra/                 # Infrastructure and deployment configs
└── docs/                  # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MediBridge
```

2. Set up the backend services:
```bash
cd backend/device-service
npm install
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

## 🔔 Real-Time Alerts Feature

MediBridge includes a real-time alert system that notifies users when medical devices fail:

### Backend Features
- **Socket.IO Integration**: Real-time communication between server and clients
- **Device Status Monitoring**: Automatically detects when devices change to "failed" status
- **Alert Broadcasting**: Emits alerts to all connected clients when devices fail

### Frontend Features
- **Real-Time Alert Banner**: Beautiful, animated alert banners that appear in the top-right corner
- **Auto-dismiss**: Alerts automatically disappear after 10 seconds
- **Manual Dismiss**: Users can manually close alerts by clicking the × button

### Testing Real-Time Alerts

1. **Start the Backend Server**:
```bash
cd backend/device-service
node index.js
```

2. **Start the Frontend**:
```bash
cd frontend
npm run dev
```

3. **Test Alerts** (in a new terminal):
```bash
cd backend/device-service
node test-alerts.js
```

4. **Manual Testing**:
   - Add a device with status "failed" via API
   - Update an existing device to "failed" status
   - Watch for real-time alert banners in the frontend

### API Endpoints

- `GET /devices` - List all devices
- `POST /devices` - Add a new device
- `PUT /devices/:id` - Update device info
- `DELETE /devices/:id` - Delete a device
- `GET /health` - Health check

### Device Status Types
- `active` - Device is working normally
- `inactive` - Device is offline/disabled
- `failed` - Device has failed (triggers alerts)

## 📋 Development

### Backend Services

The backend follows a microservices architecture:

- **device-service**: Manages medical device connections, data collection, device status monitoring, and real-time alerts

### Frontend

The frontend provides a modern web interface for healthcare providers to:
- Monitor device status
- View patient data
- Manage device configurations
- Generate reports
- Receive real-time alerts

### Infrastructure

The `infra/` directory contains:
- Docker configurations
- Kubernetes manifests
- CI/CD pipelines
- Environment configurations

## 📚 Documentation

Detailed documentation can be found in the `docs/` directory:
- API documentation
- Architecture diagrams
- Deployment guides
- User manuals

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository or contact the development team. 