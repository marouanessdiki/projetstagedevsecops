pipeline {
    agent any
    
    tools {
        maven 'Maven-3.9'
    }
    
    environment {
        DOCKER_IMAGE = 'gestion-salaries'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_HUB_USERNAME = 'marouanessdiki'
        SONAR_TOKEN = credentials('sonarqube-token1')
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
                            sh 'mvn org.sonarsource.scanner.maven:sonar-maven-plugin:sonar -Dsonar.projectKey=projetstagedevsecops -Dsonar.host.url=http://localhost:9000 -Dsonar.login=${SONAR_TOKEN}'
                            echo "✅ SonarQube analysis completed"
                        } catch (Exception e) {
                            echo "⚠️ SonarQube not available - skipping analysis"
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "🔨 Building Docker images (backend and frontend)"
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
                script {
                    try {
                        sh 'docker --version'
                        sh 'docker login -u ${DOCKER_HUB_CREDENTIALS_USR} -p ${DOCKER_HUB_CREDENTIALS_PSW}'
                        sh 'docker tag ${DOCKER_IMAGE}-api:${DOCKER_TAG} ${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE}-api:${DOCKER_TAG}'
                        sh 'docker tag ${DOCKER_IMAGE}-web:${DOCKER_TAG} ${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE}-web:${DOCKER_TAG}'
                        sh 'docker push ${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE}-api:${DOCKER_TAG}'
                        sh 'docker push ${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE}-web:${DOCKER_TAG}'
                        echo "✅ Images pushed to Docker Hub successfully"
                    } catch (Exception e) {
                        echo "⚠️ Docker Hub push failed - check credentials and Docker availability"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    try {
                        sh 'kubectl --version'
                        sh 'kubectl apply -f k8s/'
                        sh 'kubectl get all'
                        echo "✅ Application deployed to Kubernetes successfully"
                    } catch (Exception e) {
                        echo "⚠️ Kubernetes deployment failed - check kubectl configuration"
                    }
                }
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
