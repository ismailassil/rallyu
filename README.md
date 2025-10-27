# Rallyu - Online Gaming Platform

Rallyu is a modern, scalable online gaming platform built with a microservices architecture. It provides real-time multiplayer gaming experiences with features like tournaments, matchmaking, chat, and comprehensive player statistics.

## 🎯 Features

- **Real-time Multiplayer Gaming**: Engage in competitive matches with players worldwide
- **Tournament System**: Organize and participate in gaming tournaments
- **Intelligent Matchmaking**: Advanced algorithms to match players of similar skill levels
- **Live Chat**: Real-time communication between players
- **User Authentication**: Secure JWT-based authentication and authorization
- **Notifications**: Real-time push notifications for game events
- **Statistics & Analytics**: Comprehensive player statistics and game analytics
- **Responsive UI**: Modern, responsive frontend built with Next.js

## 🏗️ Architecture

Rallyu follows a microservices architecture with the following components:

### Frontend
- **Next.js 15** - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern utility-first CSS framework
- **Socket.io Client** - Real-time bidirectional communication
- **i18n** - Multi-language support

### Backend Microservices

- **API Gateway** - Central entry point for all client requests, handles routing and WebSocket connections
- **ms-auth** - Authentication and authorization service (SQLite)
- **ms-game** - Game logic and state management
- **ms-tournament** - Tournament creation and management (SQLite)
- **ms-matchmaking** - Player matchmaking and lobby management
- **ms-chat** - Real-time chat functionality (SQLite)
- **ms-notif** - Push notification service (SQLite)

### Infrastructure Services

- **NGINX** - Reverse proxy and load balancer with SSL/TLS support
- **Redis** - In-memory data store for caching and session management
- **NATS** - Message broker for inter-service communication

### DevOps & Monitoring

- **Prometheus** - Metrics collection and monitoring
- **Grafana** - Metrics visualization and dashboards
- **Elasticsearch** - Log aggregation and search
- **Logstash** - Log processing pipeline
- **Kibana** - Log visualization and analysis

## 🛠️ Technology Stack

### Frontend
- Next.js 15.5.3
- React 19.1.0
- TypeScript 5.8.3
- Tailwind CSS 4.1.3
- Socket.io Client 4.8.1
- Axios 1.9.0
- Framer Motion 12.19.2

### Backend
- Node.js (v20+)
- Fastify 5.4.0
- TypeScript 5.9.2
- Socket.io 4.8.1
- NATS 2.29.3
- JWT Authentication
- SQLite (for microservices databases)

### DevOps
- Docker & Docker Compose v2.20+
- NGINX
- Prometheus
- Grafana
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Redis Alpine 3.22
- NATS Alpine 3.22

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20 or above
- **npm**: v11.3.0 or above
- **Docker**: Latest version
- **Docker Compose**: v2.20 or above (v2.30.0 recommended)
- **Git**: For version control
- **Make**: For using Makefile commands

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ismailassil/rallyu.git
cd rallyu
```

### 2. Environment Configuration

The project uses environment variables for configuration. Run the environment setup script:

```bash
make env
```

This will execute `./env-script/spread-env.sh` to distribute environment variables across all services.

### 3. Docker Setup (Optional)

If you don't have Docker Compose v2.30.0, install it:

```bash
make docker
```

### 4. Start the Application

#### Start Application Only

```bash
make up_app
```

This will:
- Build and start all application services (frontend, backend microservices, NGINX)
- Enable watch mode for automatic rebuilds on code changes
- Services will be accessible at `http://localhost`

#### Start Application + DevOps Services

```bash
make up_all
```

This starts both the application and DevOps services (monitoring and logging).

## 📖 Usage

### Makefile Commands

The project includes a comprehensive Makefile for easy management:

#### Application Management

```bash
make up_app          # Start application services
make down_app        # Stop application services
make clean_app       # Stop and remove containers and volumes
make ps_app          # List application containers with status
make re_app          # Rebuild and restart application
```

#### DevOps Services Management

```bash
make up_devops       # Start monitoring and logging services
make down_devops     # Stop DevOps services
make clean_devops    # Stop and remove DevOps containers and volumes
make ps_devops       # List DevOps containers with status
make re_devops       # Rebuild and restart DevOps services
```

#### Complete System Management

```bash
make up_all          # Start all services (app + devops)
make down_all        # Stop all services
make clean_all       # Clean all containers and volumes
make fclean          # Full cleanup (containers, volumes, images)
make prune           # Remove all unused Docker resources
```

#### Environment & Dependencies

```bash
make env             # Load environment variables
make docker          # Install Docker Compose 2.30.0
make help            # Display help information
```

## 📂 Project Structure

```
rallyu/
├── app/
│   ├── frontend/              # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/          # Next.js app directory
│   │   │   └── messages/     # i18n message files
│   │   ├── public/           # Static assets
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── backend/              # Backend microservices
│   │   ├── api-gateway/     # API Gateway service
│   │   ├── ms-auth/         # Authentication service
│   │   ├── ms-game/         # Game logic service
│   │   ├── ms-tournament/   # Tournament service
│   │   ├── ms-matchmaking/  # Matchmaking service
│   │   ├── ms-chat/         # Chat service
│   │   ├── ms-notif/        # Notification service
│   │   └── compose.backend.yaml
│   │
│   └── compose.app.yaml      # Frontend compose configuration
│
├── devops/
│   ├── monitoring/           # Prometheus & Grafana
│   │   ├── prometheus/       # Prometheus configuration
│   │   ├── grafana/          # Grafana dashboards
│   │   ├── backend-exporter/ # Custom metrics exporter
│   │   └── compose.monitoring.yaml
│   │
│   ├── logging/              # ELK Stack
│   │   ├── elasticsearch-policy/
│   │   ├── logstash/
│   │   ├── kibana/
│   │   └── compose.logging.yaml
│   │
│   └── compose.devops.yaml   # Main DevOps compose file
│
├── nginx/                    # NGINX reverse proxy
│   ├── conf/                 # NGINX configurations
│   ├── logs/                 # NGINX logs
│   └── Dockerfile
│
├── docker-compose.yaml       # Main Docker Compose file
├── Makefile                  # Build and deployment automation
├── .env                      # Environment variables
└── README.md                 # This file
```

## 🌐 Service Endpoints

Once the application is running, you can access:

- **Frontend**: http://localhost (port 80) or https://localhost (port 443)
- **API Gateway**: http://localhost:4025 (internal)
- **Prometheus**: http://localhost:9090 (when DevOps is running)
- **Grafana**: http://localhost:3001 (when DevOps is running)
- **Kibana**: http://localhost:5601 (when DevOps is running)
- **NGINX Metrics**: http://localhost:8443 (basic auth required)
- **Redis**: localhost:6379 (internal)
- **NATS**: localhost:4222 (internal)

## 🔧 Development

### Hot Reload

The application is configured with Docker Compose watch mode, enabling hot reload during development:

- Frontend changes are synced automatically
- Backend microservices sync source code changes
- Package.json changes trigger rebuilds

### Adding Dependencies

For frontend:
```bash
cd app/frontend
npm install <package-name>
```

For backend services:
```bash
cd app/backend/<service-name>
npm install <package-name>
```

### Database Management

Each microservice that requires persistence uses SQLite:
- **ms-auth**: `app/backend/ms-auth/src/database/database.db`
- **ms-tournament**: `app/backend/ms-tournament/database/tournament.db`
- **ms-chat**: `app/backend/ms-chat/database/database.sqlite`
- **ms-notif**: `app/backend/ms-notif/database/database.sqlite`

These databases are mounted as volumes for data persistence.

## 📊 Monitoring & Logging

### Prometheus Metrics

Prometheus collects metrics from:
- NGINX (via nginx-prometheus-exporter)
- Backend services (custom metrics via fastify-metrics)
- System metrics

Access Prometheus at http://localhost:9090 after running `make up_devops`.

### Grafana Dashboards

Grafana provides pre-configured dashboards for:
- Application performance monitoring
- Request rates and latencies
- Error rates
- Resource utilization

Access Grafana at http://localhost:3001 after running `make up_devops`.

### ELK Stack Logging

Centralized logging with Elasticsearch, Logstash, and Kibana:
- **Logstash** processes and transforms logs
- **Elasticsearch** stores and indexes logs
- **Kibana** provides search and visualization

Access Kibana at http://localhost:5601 after running `make up_devops`.

## 🔐 Security

- JWT-based authentication
- NGINX reverse proxy with rate limiting
- Helmet.js for security headers
- CORS configuration
- Environment-based secrets management
- SSL/TLS support

## 🐛 Troubleshooting

### Services not starting

```bash
# Check service status
make ps_app

# Check logs
docker-compose logs <service-name>

# Restart services
make re_app
```

### Port conflicts

Ensure the following ports are available:
- 80, 443 (NGINX)
- 3000 (Frontend - internal)
- 4025 (API Gateway - internal)
- 4222 (NATS - internal)
- 6379 (Redis - internal)
- 8443, 8444 (NGINX metrics)

### Clean slate restart

```bash
make fclean  # Remove everything
make up_all  # Start fresh
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software.

## 👥 Authors

- Ismail Assil
- Azouz

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Fastify team for the fast web framework
- Docker community for containerization tools
- All open-source contributors
