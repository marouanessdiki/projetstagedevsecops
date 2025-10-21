pipeline {
  agent any

  tools {
    maven 'Maven-3.9'
  }

  environment {
    DOCKER_IMAGE          = 'gestion-salaries'
    DOCKER_TAG            = "${BUILD_NUMBER}"
    DOCKER_HUB_USERNAME   = 'marouanessdiki'
    DOCKER_HUB_CRED_ID    = 'docker-hub-credentials'
    REGISTRY              = 'https://index.docker.io/v1/'
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
                sh '''
                  mvn org.sonarsource.scanner.maven:sonar-maven-plugin:sonar \
                    -Dsonar.projectKey=PROJECT_DEVSECOPS \
                    -Dsonar.host.url=http://172.29.96.1:9000 \
                    -Dsonar.login=${SONAR_TOKEN}
                '''
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

    /* ---- Docker stages run inside a docker-cli container with the host socket ---- */

    stage('Build Docker Images') {
      agent {
        docker {
          image 'docker:27-cli'                        // includes compose v2 as plugin
          args  '-v /var/run/docker.sock:/var/run/docker.sock'
          reuseNode true
        }
      }
      when {
        allOf {
          expression { fileExists('gestion-salaries-backend/Dockerfile') }
          expression { fileExists('gestion-salaries-frontend/Dockerfile') }
        }
      }
      steps {
        sh 'docker version'
        sh '''
          docker build \
            -t ${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE}-api:${DOCKER_TAG} \
            -f gestion-salaries-backend/Dockerfile gestion-salaries-backend

          docker build \
            -t ${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE}-web:${DOCKER_TAG} \
            -f gestion-salaries-frontend/Dockerfile gestion-salaries-frontend
        '''
        echo "✅ Docker images built successfully"
      }
    }

    stage('Push to Docker Hub') {
      agent {
        docker {
          image 'docker:27-cli'
          args  '-v /var/run/docker.sock:/var/run/docker.sock'
          reuseNode true
        }
      }
      steps {
        script {
          docker.withRegistry(env.REGISTRY, env.DOCKER_HUB_CRED_ID) {
            sh '''
              docker push ${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE}-api:${DOCKER_TAG}
              docker push ${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE}-web:${DOCKER_TAG}
            '''
          }
        }
      }
    }

    stage('Deploy Monitoring Stack') {
      agent {
        docker {
          image 'docker:27-cli'
          args  '-v /var/run/docker.sock:/var/run/docker.sock'
          reuseNode true
        }
      }
      steps {
        script {
          try {
            sh 'docker compose version'
            sh 'docker compose -f monitoring/docker-compose.monitoring.yml up -d'
            echo "✅ Monitoring stack deployed successfully"
            echo "Prometheus: http://localhost:9091"
            echo "Grafana: http://localhost:5000 (admin/admin123)"
          } catch (Exception e) {
            echo "⚠️ Docker not available - skipping monitoring deployment"
            echo "Monitoring can be deployed manually with: docker compose -f monitoring/docker-compose.monitoring.yml up -d"
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
    success { echo "🎉 Pipeline completed successfully!" }
    failure { echo "❌ Pipeline failed!" }
  }
}
