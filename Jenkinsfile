pipeline {
    agent any
    
    tools {
        maven 'Maven-3.9'
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
