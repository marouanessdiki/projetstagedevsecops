pipeline {
    agent any
    
    tools {
        maven 'Maven-3.9'
        jdk 'JDK-17'
    }
    
    environment {
        SONAR_HOST_URL = 'http://host.docker.internal:9000'
        DOCKER_HUB_REPO = 'marouanessdiki/projetstagedevsecops'
        DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('1. 📥 Clone Repository') {
            steps {
                echo '📥 Cloning repository from GitHub...'
                checkout scm
            }
        }
        
        stage('2. 🔨 Build & Compile') {
            steps {
                echo '🔨 Building project with Maven...'
                bat 'mvn clean compile'
            }
        }
        
        stage('3. 🧪 Unit Tests') {
            steps {
                echo '🧪 Running unit tests...'
                bat 'mvn test'
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('4. 📦 Package') {
            steps {
                echo '📦 Packaging application...'
                bat 'mvn package -DskipTests'
            }
        }
        
        stage('5. 🔍 SonarQube Analysis') {
            steps {
                echo '🔍 Running SonarQube analysis...'
                withSonarQubeEnv('SonarQube') {
                    bat 'mvn sonar:sonar'
                }
            }
        }
        
        stage('6. ✅ Quality Gate') {
            steps {
                echo '✅ Checking quality gate...'
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage('7. 🐳 Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    bat "docker build -t ${DOCKER_HUB_REPO}:${DOCKER_IMAGE_TAG} ."
                    bat "docker tag ${DOCKER_HUB_REPO}:${DOCKER_IMAGE_TAG} ${DOCKER_HUB_REPO}:latest"
                }
            }
        }
        
        stage('8. 📤 Push to Docker Hub') {
            steps {
                echo '📤 Pushing to Docker Hub...'
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                        bat "docker push ${DOCKER_HUB_REPO}:${DOCKER_IMAGE_TAG}"
                        bat "docker push ${DOCKER_HUB_REPO}:latest"
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        always {
            cleanWs()
        }
    }
}