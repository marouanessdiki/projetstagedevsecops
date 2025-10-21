pipeline {
    agent any
    
    tools {
        maven 'Maven-3.9'
    }
    
    environment {
        DOCKER_IMAGE = 'gestion-salaries'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_HUB_USERNAME = 'marouanessdiki'
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "✅ Code checked out successfully"
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('gestion-salaries-backend') {
                    sh 'mvn clean compile'
                    echo "✅ Backend compiled successfully"
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir('gestion-salaries-backend') {
                    sh 'mvn test'
                    echo "✅ Tests completed successfully"
                }
            }
        }
        
        stage('Package Application') {
            steps {
                dir('gestion-salaries-backend') {
                    sh 'mvn package -DskipTests'
                    echo "✅ Application packaged successfully"
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('gestion-salaries-backend') {
                    script {
                        try {
                            withCredentials([string(credentialsId: 'sonarqube-token1', variable: 'SONAR_TOKEN')]) {
                                sh 'mvn org.sonarsource.scanner.maven:sonar-maven-plugin:sonar -Dsonar.projectKey=PROJECT_DEVSECOPS -Dsonar.host.url=http://172.29.96.1:9000 -Dsonar.login=${SONAR_TOKEN}'
                            }
                            echo "✅ SonarQube analysis completed"
                        } catch (Exception e) {
                            echo "⚠️ SonarQube not available - skipping analysis"
                            echo "Error: ${e.getMessage()}"
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    try {
                        sh 'docker --version'
                        sh 'docker build -t ${DOCKER_IMAGE}-api:${DOCKER_TAG} ./gestion-salaries-backend'
                        sh 'docker build -t ${DOCKER_IMAGE}-web:${DOCKER_TAG} ./gestion-salaries-frontend'
                        echo "✅ Docker images built successfully"
                    } catch (Exception e) {
                        echo "⚠️ Docker not available on Jenkins agent - skipping Docker build"
                        echo "Docker images can be built locally or on a Docker-enabled agent"
                        echo "Backend JAR file is available at: gestion-salaries-backend/target/*.jar"
                        echo "Frontend can be built with: cd gestion-salaries-frontend && npm ci && npm run build"
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "⚠️ Docker not available - skipping Docker Hub push"
                echo "Images can be pushed manually from local machine"
            }
        }

        stage('Deploy Monitoring Stack') {
            steps {
                script {
                    try {
                        sh 'docker --version'
                        sh 'docker-compose -f monitoring/docker-compose.monitoring.yml up -d'
                        echo "✅ Monitoring stack deployed successfully"
                        echo "Prometheus: http://localhost:9091"
                        echo "Grafana: http://localhost:5000 (admin/admin123)"
                    } catch (Exception e) {
                        echo "⚠️ Docker not available - skipping monitoring deployment"
                        echo "Monitoring can be deployed manually with: docker-compose -f monitoring/docker-compose.monitoring.yml up -d"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "⚠️ Kubernetes not available - skipping deployment"
                echo "Deployment can be done manually from local machine"
            }
        }
    }
    
    post {
        success {
            echo "🎉 Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
