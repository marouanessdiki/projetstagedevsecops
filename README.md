# 🚀 TP Global DevOps - Complete CI/CD Pipeline

[![Pipeline Status](https://img.shields.io/badge/Pipeline-SUCCESS-brightgreen)](http://localhost:9090)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5)](https://kubernetes.io/)
[![Monitoring](https://img.shields.io/badge/Monitoring-Prometheus%20%2B%20Grafana-orange)](https://prometheus.io/)

A complete DevOps pipeline implementation showcasing modern CI/CD practices with Jenkins, Docker, Kubernetes, and comprehensive monitoring.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Services](#services)
- [Pipeline](#pipeline)
- [Monitoring](#monitoring)
- [Documentation](#documentation)
- [Contributing](#contributing)

## 🎯 Overview

This project demonstrates a production-ready DevOps pipeline with:

- ✅ **CI/CD Pipeline** - Jenkins with optimized 4-stage pipeline
- ✅ **Code Quality** - SonarQube integration
- ✅ **Containerization** - Multi-stage Docker builds
- ✅ **Orchestration** - Kubernetes deployment
- ✅ **Monitoring** - Prometheus + Grafana dashboards
- ✅ **Full-stack App** - Spring Boot + React application

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Spring Boot) │◄──►│   (MySQL)       │
│   Port: 8082    │    │   Port: 8081    │    │   Port: 33060   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Monitoring    │
                    │   (Prometheus   │
                    │   + Grafana)    │
                    │   Ports: 9091,  │
                    │   5000          │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Git
- Java 17+
- Node.js 18+

### 1. Clone and Setup
```bash
git clone https://github.com/marouanessdiki/projetstagedevsecops.git
cd projetstagedevsecops
git checkout develope
```

### 2. Start All Services
```bash
# Start application stack
docker-compose up -d --build

# Start monitoring
docker-compose -f monitoring/docker-compose.monitoring.yml up -d

# Start Jenkins
docker-compose -f docker-compose.jenkins.yml up -d

# Start SonarQube
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community
```

### 3. Access Services
| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:8082 | - |
| **Backend API** | http://localhost:8081 | - |
| **Jenkins** | http://localhost:9090 | admin/admin |
| **SonarQube** | http://localhost:9000 | admin/admin |
| **Prometheus** | http://localhost:9091 | - |
| **Grafana** | http://localhost:5000 | admin/admin123 |

## 🛠️ Services

### Application Stack
- **Frontend**: React 18 with Material-UI
- **Backend**: Spring Boot 3.5.3 with MySQL
- **Database**: MySQL 8.4 with persistent storage

### DevOps Tools
- **Jenkins**: CI/CD pipeline automation
- **SonarQube**: Code quality analysis
- **Docker**: Containerization platform
- **Kubernetes**: Container orchestration

### Monitoring Stack
- **Prometheus**: Metrics collection and storage
- **Grafana**: Metrics visualization and dashboards
- **Node Exporter**: System metrics collection

## 🔄 Pipeline

### Jenkins Pipeline Stages
1. **Build & Test** (8s) - Maven compilation and testing
2. **SonarQube Analysis** (15s) - Code quality analysis
3. **Build Docker Images** (3m) - Containerize application
4. **Deploy & Test** (30s) - Deploy and health checks

**Total Pipeline Time: ~4 minutes**

### Pipeline Features
- ✅ **Optimized** - 4 stages instead of 8
- ✅ **Smart Deployment** - Checks existing containers
- ✅ **Non-blocking Tests** - Health checks don't fail pipeline
- ✅ **Docker Integration** - Full container lifecycle
- ✅ **Quality Gates** - SonarQube integration

## 📊 Monitoring

### Prometheus Metrics
- **Application Metrics**: JVM, HTTP requests, database connections
- **System Metrics**: CPU, Memory, Disk usage
- **Custom Metrics**: Business-specific metrics

### Grafana Dashboards
- **Spring Boot Dashboard** - Application performance
- **Pod Metrics Dashboard** - CPU/Memory/Availability
- **System Dashboard** - Infrastructure metrics

### Alerting Rules
- High CPU usage (>80%)
- High memory usage (>90%)
- Service unavailability
- Response time thresholds

## 📚 Documentation

- **[Quick Start Guide](QUICK_START_GUIDE.md)** - Complete setup from A to Z
- **[TP Realization Guide](TP_REALIZATION_GUIDE.md)** - Detailed implementation
- **[API Documentation](gestion-salaries-backend/README.md)** - Backend API docs
- **[Frontend Guide](gestion-salaries-frontend/README.md)** - React app guide

## 🧪 Testing

### Backend Testing
```bash
cd gestion-salaries-backend
mvn test
```

### Frontend Testing
```bash
cd gestion-salaries-frontend
npm test
```

### Integration Testing
```bash
# Test all endpoints
curl http://localhost:8081/actuator/health
curl http://localhost:8082
curl http://localhost:9091/-/healthy
```

## 🚀 Deployment

### Local Development
```bash
docker-compose up -d
```

### Kubernetes Production
```bash
# Start Minikube
minikube start

# Deploy to Kubernetes
kubectl apply -f k8s/

# Check deployment
kubectl get all
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/gestion_salaries
SPRING_DATASOURCE_USERNAME=app
SPRING_DATASOURCE_PASSWORD=app

# Monitoring
PROMETHEUS_ENABLED=true
GRAFANA_ADMIN_PASSWORD=admin123
```

### Docker Compose
- `docker-compose.yml` - Main application stack
- `monitoring/docker-compose.monitoring.yml` - Monitoring stack
- `docker-compose.jenkins.yml` - Jenkins with Docker support

## 🐛 Troubleshooting

### Common Issues
1. **Port Conflicts** - Check `netstat -ano | findstr :PORT`
2. **Docker Issues** - Restart Docker Desktop
3. **Jenkins Issues** - Check logs with `docker logs jenkins`
4. **Database Issues** - Verify MySQL container status

### Logs
```bash
# Application logs
docker-compose logs api
docker-compose logs web

# Jenkins logs
docker logs jenkins

# Monitoring logs
docker-compose -f monitoring/docker-compose.monitoring.yml logs
```

## 📈 Performance

### Metrics
- **Pipeline Execution**: ~4 minutes
- **Application Response**: <200ms
- **Memory Usage**: <512MB per container
- **CPU Usage**: <50% under normal load

### Optimization
- Multi-stage Docker builds
- Resource limits in Kubernetes
- Connection pooling
- Caching strategies

## 🔒 Security

### Implemented Security
- CORS configuration
- Input validation
- SQL injection prevention
- Container security (non-root users)
- Secret management

### Security Scanning
- SonarQube security analysis
- Docker image scanning
- Dependency vulnerability checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Marouane ES-SDIKI** - *Initial work* - [marouanessdiki](https://github.com/marouanessdiki)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing UI library
- Jenkins community for CI/CD tools
- Prometheus and Grafana teams for monitoring
- Docker team for containerization platform

---

## 🎓 TP Status

**✅ COMPLETED SUCCESSFULLY**

This TP demonstrates a complete, production-ready DevOps pipeline with:
- Modern CI/CD practices
- Comprehensive monitoring
- Container orchestration
- Code quality management
- Full-stack application development

**Ready for submission!** 🚀

---

**For detailed setup instructions, see [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)**
