# 🚀 Quick Start Guide - TP Global DevOps

## **Complete Setup from A to Z**

### **Prerequisites**
- Docker Desktop
- Git
- Java 17+
- Node.js 18+

---

## **1. Clone and Setup Project**

```bash
# Clone the repository
git clone https://github.com/marouanessdiki/projetstagedevsecops.git
cd projetstagedevsecops

# Switch to develop branch
git checkout develope
```

---

## **2. Start All Services**

### **Start Application Stack**
```bash
# Start the main application
docker-compose up -d --build

# Wait for services to start (60 seconds)
sleep 60
```

### **Start Monitoring Stack**
```bash
# Start monitoring (Prometheus + Grafana)
docker-compose -f monitoring/docker-compose.monitoring.yml up -d

# Wait for monitoring to start (30 seconds)
sleep 30
```

### **Start Jenkins**
```bash
# Start Jenkins with Docker support
docker-compose -f docker-compose.jenkins.yml up -d

# Wait for Jenkins to start (60 seconds)
sleep 60
```

### **Start SonarQube**
```bash
# Start SonarQube
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community

# Wait for SonarQube to start (60 seconds)
sleep 60
```

---

## **3. Access All Services**

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:8082 | - |
| **Backend API** | http://localhost:8081 | - |
| **Database** | localhost:33060 | root/root1234 |
| **Jenkins** | http://localhost:9090 | admin/admin |
| **SonarQube** | http://localhost:9000 | admin/admin |
| **Prometheus** | http://localhost:9091 | - |
| **Grafana** | http://localhost:5000 | admin/admin123 |

---

## **4. Configure Jenkins Pipeline**

### **4.1 Access Jenkins**
1. Go to http://localhost:9090
2. Login with `admin/admin`
3. Install suggested plugins

### **4.2 Configure Tools**
1. **Manage Jenkins** → **Global Tool Configuration**
2. **Maven**: Add Maven 3.9 installation
3. **Git**: Use default Git installation

### **4.3 Add Credentials**
1. **Manage Jenkins** → **Manage Credentials**
2. Add **GitHub credentials** (ID: `github-credentials`)
3. Add **SonarQube token** (ID: `sonarqube-token1`)

### **4.4 Create Pipeline Job**
1. **New Item** → **Pipeline**
2. **Pipeline script from SCM**
3. **Repository URL**: `https://github.com/marouanessdiki/projetstagedevsecops.git`
4. **Branch**: `develope`
5. **Script Path**: `Jenkinsfile`

---

## **5. Run the Pipeline**

1. Click **"Build Now"** in Jenkins
2. Watch the pipeline execute:
   - ✅ **Build & Test** (8 seconds)
   - ✅ **SonarQube Analysis** (15 seconds)
   - ✅ **Build Docker Images** (3 minutes)
   - ✅ **Deploy & Test** (30 seconds)

**Total Pipeline Time: ~4 minutes**

---

## **6. Verify Everything Works**

### **Test Application**
```bash
# Test backend health
curl http://localhost:8081/actuator/health

# Test frontend
curl http://localhost:8082
```

### **Test Monitoring**
```bash
# Test Prometheus
curl http://localhost:9091/-/healthy

# Test Grafana
curl http://localhost:5000/api/health
```

### **Test SonarQube**
```bash
# Test SonarQube
curl http://localhost:9000/api/system/status
```

---

## **7. Access Dashboards**

### **Grafana Dashboards**
1. Go to http://localhost:5000
2. Login: `admin/admin123`
3. Import dashboards:
   - Spring Boot Dashboard
   - Pod Metrics Dashboard

### **Prometheus Metrics**
1. Go to http://localhost:9091
2. Check targets: **Status** → **Targets**
3. View metrics: **Graph**

### **SonarQube Quality**
1. Go to http://localhost:9000
2. Login: `admin/admin`
3. View project: **PROJECT_DEVSECOPS**

---

## **8. Kubernetes Deployment (Optional)**

```bash
# Start Minikube
minikube start

# Deploy to Kubernetes
kubectl apply -f k8s/

# Check deployment
kubectl get all
```

---

## **🎉 Success!**

Your complete DevOps pipeline is now running:

- ✅ **CI/CD Pipeline** (Jenkins)
- ✅ **Code Quality** (SonarQube)
- ✅ **Containerization** (Docker)
- ✅ **Orchestration** (Kubernetes)
- ✅ **Monitoring** (Prometheus + Grafana)
- ✅ **Full-stack Application** (Spring Boot + React)

**Total setup time: ~10 minutes**

---

## **Troubleshooting**

### **Port Conflicts**
```bash
# Check what's using ports
netstat -ano | findstr :8081
netstat -ano | findstr :8082
netstat -ano | findstr :9090
```

### **Docker Issues**
```bash
# Restart Docker
docker-compose down
docker-compose up -d --build
```

### **Jenkins Issues**
```bash
# Check Jenkins logs
docker logs jenkins

# Restart Jenkins
docker restart jenkins
```

---

## **Cleanup**

```bash
# Stop all services
docker-compose down
docker-compose -f monitoring/docker-compose.monitoring.yml down
docker-compose -f docker-compose.jenkins.yml down
docker stop sonarqube

# Remove all containers
docker system prune -a
```

---

**🎓 Your TP is ready for submission!**