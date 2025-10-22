# 🚀 Quick Start Guide - Complete Project Setup

## 📋 Prerequisites

Before starting, ensure you have installed:
- **Docker** and **Docker Compose**
- **Git** (for cloning the repository)
- **Java 21** (for local development)
- **Node.js 18+** (for frontend development)
- **Maven** (for backend builds)

## 🎯 Complete Setup (A to Z)

### **Step 1: Clone and Navigate to Project**
```bash
git clone <your-repository-url>
cd "project stage devsecops"
```

### **Step 2: Start the Main Application Stack**
```bash
# Start all services (MySQL, Spring Boot API, React Frontend)
docker-compose up -d --build
```

**Wait for services to start** (2-3 minutes), then verify:
```bash
# Check if all containers are running
docker ps
```

**Expected output**: 3 containers running (db, api, web)

### **Step 3: Start the Monitoring Stack**
```bash
# Start Prometheus, Grafana, and Node Exporter
docker-compose -f monitoring/docker-compose.monitoring.yml up -d
```

**Verify monitoring stack**:
```bash
# Check monitoring containers
docker ps | grep -E "(prometheus|grafana|node-exporter)"
```

### **Step 4: Start Jenkins (CI/CD)**
```bash
# Start Jenkins with Docker support
docker run -d --name jenkins \
  -p 9090:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

**Wait for Jenkins to start** (3-5 minutes), then access: `http://localhost:9090`

### **Step 5: Start SonarQube (Code Quality)**
```bash
# Start SonarQube
docker run -d --name sonarqube \
  -p 9000:9000 \
  -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
  sonarqube:lts-community
```

**Wait for SonarQube to start** (2-3 minutes), then access: `http://localhost:9000`

### **Step 6: Start Kubernetes (Minikube)**
```bash
# Start Minikube
minikube start

# Enable ingress addon
minikube addons enable ingress

# Check cluster status
kubectl get nodes
```

## 🌐 Access URLs

After completing all steps, access your services at:

| Service | URL | Credentials |
|---------|-----|-------------|
| **React Frontend** | http://localhost:8082 | - |
| **Spring Boot API** | http://localhost:8081 | - |
| **Jenkins** | http://localhost:9090 | admin / (check logs for password) |
| **SonarQube** | http://localhost:9000 | admin / admin |
| **Prometheus** | http://localhost:9091 | - |
| **Grafana** | http://localhost:5000 | admin / admin |
| **MySQL** | localhost:33060 | root / root1234 |

## 🔧 Quick Commands

### **Start Everything at Once**
```bash
# Main application
docker-compose up -d --build

# Monitoring
docker-compose -f monitoring/docker-compose.monitoring.yml up -d

# Jenkins
docker run -d --name jenkins -p 9090:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkins/jenkins:lts

# SonarQube
docker run -d --name sonarqube -p 9000:9000 -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true sonarqube:lts-community

# Kubernetes
minikube start && minikube addons enable ingress
```

### **Stop Everything**
```bash
# Stop main application
docker-compose down

# Stop monitoring
docker-compose -f monitoring/docker-compose.monitoring.yml down

# Stop Jenkins
docker stop jenkins && docker rm jenkins

# Stop SonarQube
docker stop sonarqube && docker rm sonarqube

# Stop Kubernetes
minikube stop
```

### **Check Status**
```bash
# Check all containers
docker ps

# Check Kubernetes pods
kubectl get pods

# Check services
kubectl get services
```

## 🧪 Test the Application

### **1. Test Frontend**
- Open http://localhost:8082
- You should see the React application

### **2. Test API**
```bash
# Test health endpoint
curl http://localhost:8081/actuator/health

# Test API endpoints
curl http://localhost:8081/api/employees
```

### **3. Test Monitoring**
- Open http://localhost:9091 (Prometheus)
- Open http://localhost:5000 (Grafana)
- Login to Grafana: admin/admin

### **4. Test Jenkins**
- Open http://localhost:9090
- Get initial password: `docker logs jenkins`
- Create a new pipeline job

### **5. Test SonarQube**
- Open http://localhost:9000
- Login: admin/admin
- Create a new project

## 🚀 Deploy to Kubernetes

### **Deploy Application to Kubernetes**
```bash
# Deploy MySQL
kubectl apply -f k8s/statefulset-mysql.yaml
kubectl apply -f k8s/service-mysql.yaml

# Deploy Backend
kubectl apply -f k8s/deployment-backend.yaml
kubectl apply -f k8s/service-backend.yaml

# Deploy Frontend
kubectl apply -f k8s/deployment-frontend.yaml
kubectl apply -f k8s/service-frontend.yaml

# Deploy Monitoring
kubectl apply -f k8s/prometheus-deployment.yaml
kubectl apply -f k8s/grafana-deployment.yaml
kubectl apply -f k8s/node-exporter-daemonset.yaml

# Deploy Ingress
kubectl apply -f k8s/ingress.yaml
```

### **Check Kubernetes Deployment**
```bash
# Check all resources
kubectl get all

# Check services
kubectl get services

# Check ingress
kubectl get ingress
```

## 🔍 Troubleshooting

### **Common Issues**

#### **Port Conflicts**
```bash
# Check what's using a port
netstat -ano | findstr :8080

# Kill process using port (Windows)
taskkill /PID <PID> /F
```

#### **Docker Issues**
```bash
# Restart Docker
docker-compose down
docker-compose up -d --build

# Clean up containers
docker system prune -a
```

#### **Kubernetes Issues**
```bash
# Restart Minikube
minikube stop
minikube start

# Check logs
kubectl logs <pod-name>
```

#### **Database Connection Issues**
```bash
# Check MySQL logs
docker logs projectstagedevsecops-db-1

# Restart database
docker-compose restart db
```

## 📊 Monitoring Setup

### **Import Grafana Dashboards**
1. Open http://localhost:5000
2. Login: admin/admin
3. Click "+" → "Import"
4. Import these dashboard IDs:
   - **Spring Boot**: `12900`
   - **Node Exporter**: `1860`
   - **Jenkins**: `9964`

### **Configure Prometheus Data Source**
1. Go to Grafana → Configuration → Data Sources
2. Add Prometheus data source
3. URL: `http://prometheus:9090`
4. Click "Save & Test"

## 🎯 Development Workflow

### **Local Development**
```bash
# Backend development
cd gestion-salaries-backend
./mvnw spring-boot:run

# Frontend development
cd gestion-salaries-frontend
npm start
```

### **Build and Deploy**
```bash
# Build backend
cd gestion-salaries-backend
./mvnw clean package

# Build frontend
cd gestion-salaries-frontend
npm run build

# Deploy with Docker
docker-compose up -d --build
```

## 📝 Notes

- **First startup** may take 5-10 minutes for all services
- **Jenkins** requires initial setup (get password from logs)
- **SonarQube** may take 2-3 minutes to fully start
- **Kubernetes** deployment requires Minikube to be running
- **Monitoring** data will appear after a few minutes

## 🆘 Need Help?

If you encounter issues:
1. Check container logs: `docker logs <container-name>`
2. Verify all services are running: `docker ps`
3. Check port availability: `netstat -ano | findstr :<port>`
4. Restart services: `docker-compose restart`

---

**🎉 Congratulations! Your complete DevOps stack is now running!**
