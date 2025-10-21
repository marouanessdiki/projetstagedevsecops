# DevOps Setup Guide - Gestion Salaries

## Prerequisites
- Jenkins installed and running
- SonarQube installed and running
- Docker installed
- Kubernetes cluster (Minikube or cloud)
- kubectl configured

## Step 1: Jenkins Configuration

### 1.1 Install Required Plugins
- Docker Pipeline
- SonarQube Scanner
- Kubernetes CLI

### 1.2 Configure Credentials
1. Go to Jenkins > Manage Jenkins > Manage Credentials
2. Add credentials:
   - **Docker Hub**: Username/Password for Docker Hub
   - **SonarQube Token**: Generate token from SonarQube

### 1.3 Create Pipeline Job
1. New Item > Pipeline
2. Name: `gestion-salaries-pipeline`
3. Pipeline script from SCM
4. Repository: Your GitHub repo
5. Script path: `Jenkinsfile`

## Step 2: SonarQube Configuration

### 2.1 Create Project
1. Login to SonarQube (http://localhost:9000)
2. Create new project: `gestion-salaries`
3. Generate token for Jenkins

### 2.2 Quality Gate
- Set up quality gate with:
  - Coverage > 80%
  - Duplicated Lines < 3%
  - Maintainability Rating A
  - Reliability Rating A
  - Security Rating A

## Step 3: Docker Hub Setup

### 3.1 Update Docker Hub Username
1. Replace `your-dockerhub-username` in:
   - Jenkinsfile
   - k8s/deployment-*.yaml files

### 3.2 Build and Push Images
```bash
# Build images
docker build -t your-username/gestion-salaries-api:latest ./gestion-salaries-backend
docker build -t your-username/gestion-salaries-web:latest ./gestion-salaries-frontend

# Push to Docker Hub
docker push your-username/gestion-salaries-api:latest
docker push your-username/gestion-salaries-web:latest
```

## Step 4: Kubernetes Deployment

### 4.1 Start Minikube
```bash
minikube start
minikube addons enable ingress
```

### 4.2 Deploy Application
```bash
# Deploy all components
kubectl apply -f k8s/

# Check status
kubectl get all
```

### 4.3 Access Application
```bash
# Get service URL
minikube service frontend-service --url

# Or add to /etc/hosts
echo "$(minikube ip) gestion-salaries.local" | sudo tee -a /etc/hosts
# Then access: http://gestion-salaries.local
```

## Step 5: Monitoring Setup

### 5.1 Deploy Prometheus and Grafana
```bash
kubectl apply -f k8s/prometheus-config.yaml
kubectl apply -f k8s/prometheus-deployment.yaml
kubectl apply -f k8s/grafana-deployment.yaml
```

### 5.2 Access Monitoring
```bash
# Prometheus
minikube service prometheus-service --url

# Grafana
minikube service grafana-service --url
# Login: admin/admin123
```

## Step 6: Pipeline Execution

### 6.1 Trigger Pipeline
1. Push code to GitHub
2. Jenkins will automatically trigger the pipeline
3. Monitor build progress in Jenkins

### 6.2 Pipeline Stages
1. ✅ Checkout code
2. ✅ Build backend (Maven)
3. ✅ Run tests
4. ✅ Package application
5. ✅ Build frontend (npm)
6. ✅ SonarQube analysis
7. ✅ Build Docker images
8. ✅ Test containers
9. ✅ Push to Docker Hub
10. ✅ Deploy to Kubernetes

## Troubleshooting

### Common Issues
1. **SonarQube connection failed**: Check token and URL
2. **Docker push failed**: Check credentials
3. **Kubernetes deployment failed**: Check image names and resources
4. **Monitoring not working**: Check service endpoints

### Useful Commands
```bash
# Check pods
kubectl get pods

# Check logs
kubectl logs -f deployment/gestion-salaries-backend

# Check services
kubectl get services

# Port forward for testing
kubectl port-forward service/frontend-service 8080:80
```

## Expected Results

### Quality Metrics
- **Code Coverage**: > 80%
- **Duplicated Lines**: < 3%
- **Maintainability**: A
- **Reliability**: A
- **Security**: A

### Performance Metrics
- **Response Time**: < 200ms
- **CPU Usage**: < 70%
- **Memory Usage**: < 80%
- **Uptime**: > 99.9%

## Documentation Checklist

- [ ] Jenkins pipeline screenshots
- [ ] SonarQube quality report
- [ ] Docker Hub images
- [ ] Kubernetes deployment status
- [ ] Grafana dashboard screenshots
- [ ] Performance metrics
- [ ] Video demonstration
