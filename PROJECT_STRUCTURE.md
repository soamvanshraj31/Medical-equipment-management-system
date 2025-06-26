# MedEquipFlow Project Structure

This document outlines the organized structure of the MedEquipFlow Smart Medical Asset Manager project.

## 📁 Root Directory Structure

```
MedEquipFlow/
├── 📁 backend/                    # Go Backend API
│   ├── 📁 cmd/                    # Command-line applications
│   ├── 📁 internal/               # Internal application code
│   │   ├── 📁 handlers/           # HTTP request handlers
│   │   │   ├── device.go          # Device-related endpoints
│   │   │   └── analytics.go       # Analytics endpoints
│   │   ├── 📁 models/             # Data models
│   │   │   └── device.go          # Device, User, RepairRequest models
│   │   └── 📁 services/           # Business logic services
│   ├── 📁 pkg/                    # Reusable packages
│   │   ├── 📁 database/           # Database initialization
│   │   │   └── database.go        # GORM setup and seeding
│   │   └── 📁 websocket/          # WebSocket management
│   │       └── websocket.go       # Real-time communication
│   ├── main.go                    # Application entry point
│   ├── go.mod                     # Go module dependencies
│   └── Dockerfile                 # Backend containerization
├── 📁 frontend/                   # Next.js Frontend Application
│   ├── 📁 app/                    # Next.js 14 app directory
│   │   ├── 📁 components/         # React components
│   │   │   ├── DeviceGrid.tsx     # Device inventory display
│   │   │   ├── AnalyticsPanel.tsx # Analytics dashboard
│   │   │   └── RealTimeAlerts.tsx # Real-time notifications
│   │   ├── 📁 constants/          # Application constants
│   │   │   └── departments.ts     # Department definitions
│   │   ├── globals.css
│   │   ├── hooks/
│   │   ├── layout.tsx
│   │   ├── lib/
│   │   ├── page.tsx
│   │   ├── types/
│   │   └── utils/
│   ├── Dockerfile
│   ├── mock-server.js
│   ├── next-env.d.ts
│   ├── next.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── docker-compose.yml
├── docker-compose.prod.yml
├── LICENSE
├── package-lock.json
├── package.json
├── PROJECT_STRUCTURE.md
├── README.md
├── SETUP.md
└── .gitignore                     # Git ignore rules
```

## 🏗️ Architecture Overview

### Backend Architecture (GoLang)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   HTTP Layer    │    │   Business      │    │   Data Layer    │
│   (Gin Router)  │◄──►│   Logic         │◄──►│   (GORM/PostgreSQL)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   WebSocket    │◄─────────────┘
                        │   Manager      │
                        └─────────────────┘
```

#### Package Organization:
- **`cmd/`**: Command-line applications and entry points
- **`internal/`**: Application-specific code (not importable)
  - **`handlers/`**: HTTP request handlers for API endpoints
  - **`models/`**: Data structures and database models
  - **`services/`**: Business logic and domain services
- **`pkg/`**: Reusable packages (importable by other projects)
  - **`database/`**: Database connection and initialization
  - **`websocket/`**: Real-time communication management

### Frontend Architecture (Next.js)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Layer      │    │   State         │    │   API Layer     │
│   (Components)  │◄──►│   Management    │◄──►│   (HTTP/WebSocket)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   Utilities    │◄─────────────┘
                        │   & Constants  │
                        └─────────────────┘
```

#### Directory Organization:
- **`components/`**: Reusable React components
- **`constants/`**: Application constants and configurations
- **`hooks/`**: Custom React hooks for shared logic
- **`lib/`**: External library integrations and API clients
- **`utils/`**: Utility functions and helpers

## 🔧 Key Features by Directory

### Backend Features

#### `internal/handlers/`
- **Device Management**: CRUD operations for medical devices
- **Analytics**: Predictive analytics and utilization metrics
- **Real-time Updates**: WebSocket integration for live data

#### `internal/models/`
- **Device**: Medical device information and status
- **User**: User management and authentication
- **RepairRequest**: Maintenance request tracking

#### `pkg/database/`
- **GORM Integration**: PostgreSQL ORM setup
- **Auto-migration**: Automatic database schema updates
- **Data Seeding**: Sample data for development

#### `pkg/websocket/`
- **Real-time Communication**: Live device status updates
- **Connection Management**: Client connection handling
- **Broadcasting**: Multi-client message distribution

### Frontend Features

#### `components/`
- **DeviceGrid**: Interactive device inventory display
- **AnalyticsPanel**: Real-time analytics and metrics
- **RealTimeAlerts**: Live notification system

#### `lib/`
- **API Client**: Centralized HTTP request management
- **Type Definitions**: TypeScript interfaces and types
- **WebSocket Integration**: Real-time data handling

#### `utils/`
- **Date Formatting**: Consistent date/time display
- **Validation**: Input validation and sanitization
- **Helpers**: Common utility functions

#### `constants/`
- **Department Definitions**: Hospital department configurations
- **Status Mappings**: Device status color and icon mappings
- **Configuration**: Application-wide constants

## 🚀 Deployment Structure

### Development Environment
- **Docker Compose**: Local development with all services
- **Hot Reloading**: Automatic code reloading for both frontend and backend
- **Database Seeding**: Automatic sample data population

### Production Environment
- **Azure Container Instances**: Scalable cloud deployment
- **GitHub Actions**: Automated CI/CD pipeline
- **Container Registry**: Docker image storage and distribution

## 📊 Data Flow

```
1. User Interaction → React Component
2. Component → API Client (lib/api.ts)
3. API Client → GoLang Backend (internal/handlers/)
4. Handler → Business Logic (internal/services/)
5. Service → Database (pkg/database/)
6. Database → WebSocket Broadcast (pkg/websocket/)
7. WebSocket → Frontend Components (hooks/useWebSocket.ts)
8. Components → UI Update
```

## 🔒 Security & Best Practices

### Backend Security
- **CORS Configuration**: Cross-origin request handling
- **Input Validation**: Request data sanitization
- **Error Handling**: Graceful error responses
- **Database Security**: Parameterized queries via GORM

### Frontend Security
- **Type Safety**: TypeScript for compile-time error checking
- **API Abstraction**: Centralized API client with error handling
- **Input Validation**: Client-side form validation
- **Secure Communication**: HTTPS and WebSocket security

## 📈 Scalability Considerations

### Backend Scalability
- **Stateless Design**: No server-side session storage
- **Database Connection Pooling**: Efficient database connections
- **WebSocket Scaling**: Horizontal scaling support
- **Caching**: Redis integration for performance

### Frontend Scalability
- **Component Reusability**: Modular component architecture
- **State Management**: Efficient React state handling
- **Code Splitting**: Next.js automatic code splitting
- **Performance Optimization**: Image optimization and lazy loading

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: Data persistence testing

### Frontend Testing
- **Component Tests**: React component testing
- **Integration Tests**: User interaction testing
- **E2E Tests**: Full application workflow testing

This organized structure ensures maintainability, scalability, and follows industry best practices for modern web application development. 

**MedEquipFlow** - Smart Medical Asset Manager for modern healthcare facilities. 