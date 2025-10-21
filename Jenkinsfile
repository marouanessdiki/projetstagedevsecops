pipeline {
    agent any
    
    tools {
        maven 'Maven-3.9'
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
        
        stage('Build Backend Docker Image') {
            steps {
                script {
                    echo "Building backend Docker image..."
                    sh 'docker build -t ${DOCKER_IMAGE}-api:${DOCKER_TAG} ./gestion-salaries-backend'
                }
                echo "✅ Backend Docker image built successfully"
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
