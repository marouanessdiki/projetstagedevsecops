#!/bin/bash

echo "🚀 Deploying Monitoring Stack to Kubernetes..."

# Create monitoring namespace (optional)
echo "📦 Creating monitoring namespace..."
kubectl apply -f k8s/namespace-monitoring.yaml

# Deploy Node Exporter
echo "📊 Deploying Node Exporter..."
kubectl apply -f k8s/node-exporter-daemonset.yaml

# ServiceMonitors removed - using direct Prometheus configuration instead

# Deploy main application
echo "🏗️ Deploying main application..."
kubectl apply -f k8s/statefulset-mysql.yaml
kubectl apply -f k8s/service-mysql.yaml
kubectl apply -f k8s/deployment-backend.yaml
kubectl apply -f k8s/service-backend.yaml
kubectl apply -f k8s/deployment-frontend.yaml
kubectl apply -f k8s/service-frontend.yaml

# Deploy Prometheus and Grafana
echo "📈 Deploying Prometheus and Grafana..."
kubectl apply -f k8s/prometheus-deployment.yaml
kubectl apply -f k8s/grafana-deployment.yaml

# Deploy Ingress
echo "🌐 Deploying Ingress..."
kubectl apply -f k8s/ingress.yaml

echo "✅ Monitoring stack deployed successfully!"
echo ""
echo "📊 Access URLs:"
echo "  - Grafana: http://localhost:3000 (admin/admin123)"
echo "  - Prometheus: http://localhost:9090"
echo "  - Application: http://localhost:8080"
echo ""
echo "🔍 Check status with: kubectl get all"
