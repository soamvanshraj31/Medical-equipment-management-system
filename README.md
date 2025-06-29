# MediBridge

A modern healthcare platform connecting medical devices and healthcare providers through a robust microservices architecture.

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

## 📋 Development

### Backend Services

The backend follows a microservices architecture:

- **device-service**: Manages medical device connections, data collection, and device status monitoring

### Frontend

The frontend provides a modern web interface for healthcare providers to:
- Monitor device status
- View patient data
- Manage device configurations
- Generate reports

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