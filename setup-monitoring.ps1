# Complete TP Setup Script
Write-Host "🚀 Setting up complete DevSecOps TP with monitoring..." -ForegroundColor Green

# 1. Start Jenkins with Docker access
Write-Host "📦 Starting Jenkins with Docker access..." -ForegroundColor Yellow
docker stop jenkins 2>$null
docker rm jenkins 2>$null
docker run -d --name jenkins -p 9090:8080 -v /var/run/docker.sock:/var/run/docker.sock -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts

# 2. Start main application
Write-Host "🏗️ Starting main application..." -ForegroundColor Yellow
docker-compose up -d

# 3. Start monitoring stack
Write-Host "📊 Starting monitoring stack..." -ForegroundColor Yellow
docker-compose -f monitoring/docker-compose.monitoring.yml up -d

# 4. Wait for services
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# 5. Show status
Write-Host "✅ Setup complete! Access URLs:" -ForegroundColor Green
Write-Host "   Jenkins: http://localhost:9090" -ForegroundColor Cyan
Write-Host "   Application: http://localhost:8081" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:8082" -ForegroundColor Cyan
Write-Host "   Prometheus: http://localhost:9090" -ForegroundColor Cyan
Write-Host "   Grafana: http://localhost:3000 (admin/admin123)" -ForegroundColor Cyan

Write-Host "🎉 Your complete DevSecOps TP is ready!" -ForegroundColor Green
