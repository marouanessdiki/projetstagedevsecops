pipeline {
    agent any
    
    tools {
        maven 'Maven-3.9'  // This should match the Maven tool name you configured
    }
    
    environment {
        DOCKER_IMAGE = 'gestion-salaries'
        DOCKER_TAG = "${BUILD_NUMBER}"
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
        
        stage('Build Frontend') {
            steps {
                dir('gestion-salaries-frontend') {
                    script {
                        // Try system Node.js first, fallback to Docker if needed
                        try {
                            sh 'node --version'
                            sh 'npm --version'
                            sh 'npm ci'
                            sh 'npm run build'
                        } catch (Exception e) {
                            echo "System Node.js failed, using Docker for frontend build"
                            sh 'docker run --rm -v ${WORKSPACE}/gestion-salaries-frontend:/app -w /app node:18-alpine npm ci'
                            sh 'docker run --rm -v ${WORKSPACE}/gestion-salaries-frontend:/app -w /app node:18-alpine npm run build'
                        }
                    }
                    echo "✅ Frontend built successfully"
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}-api:${DOCKER_TAG} ./gestion-salaries-backend'
                sh 'docker build -t ${DOCKER_IMAGE}-web:${DOCKER_TAG} ./gestion-salaries-frontend'
                echo "✅ Docker images built successfully"
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo "🎉 Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
