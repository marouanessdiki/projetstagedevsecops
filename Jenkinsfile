pipeline {
    agent any
    
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
                    script {
                        if (isUnix()) {
                            sh './mvnw clean compile'
                        } else {
                            bat 'mvnw.cmd clean compile'
                        }
                    }
                    echo "✅ Backend compiled successfully"
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir('gestion-salaries-backend') {
                    script {
                        if (isUnix()) {
                            sh './mvnw test'
                        } else {
                            bat 'mvnw.cmd test'
                        }
                    }
                    echo "✅ Tests completed successfully"
                }
            }
        }
        
        stage('Package Application') {
            steps {
                dir('gestion-salaries-backend') {
                    script {
                        if (isUnix()) {
                            sh './mvnw package -DskipTests'
                        } else {
                            bat 'mvnw.cmd package -DskipTests'
                        }
                    }
                    echo "✅ Application packaged successfully"
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('gestion-salaries-frontend') {
                    script {
                        if (isUnix()) {
                            sh 'npm ci'
                            sh 'npm run build'
                        } else {
                            bat 'npm ci'
                            bat 'npm run build'
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
