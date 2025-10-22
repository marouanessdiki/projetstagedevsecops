#!/bin/bash

echo "🔧 Configuring Jenkins for monitoring..."

# Wait for Jenkins to be ready
echo "⏳ Waiting for Jenkins to be ready..."
while ! curl -f http://localhost:9090/login > /dev/null 2>&1; do
    echo "Waiting for Jenkins..."
    sleep 5
done

echo "✅ Jenkins is ready!"

# Get Jenkins CLI
echo "📥 Downloading Jenkins CLI..."
wget -O jenkins-cli.jar http://localhost:9090/jnlpJars/jenkins-cli.jar

# Install Prometheus plugin
echo "🔌 Installing Prometheus plugin..."
java -jar jenkins-cli.jar -s http://localhost:9090 install-plugin prometheus -restart

# Wait for restart
echo "⏳ Waiting for Jenkins to restart..."
sleep 30

# Verify plugin installation
echo "✅ Jenkins configuration completed!"
echo "🌐 Access Jenkins at: http://localhost:9090"
echo "📊 Access Prometheus metrics at: http://localhost:9090/prometheus"
echo "📈 Access Grafana at: http://localhost:5000"
