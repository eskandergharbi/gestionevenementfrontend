pipeline {
    agent any

    environment {
        SONARQUBE = 'SonarQube'
        DOCKER_HUB_CREDENTIALS = 'Amine392*'
        DOCKER_HUB_NAMESPACE = 'eskandergharbi' // remplace par ton nom DockerHub
        IMAGE_NAME = 'gestionevenementfrontend'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/eskandergharbi/gestionevenementfrontend.git'
            }
        }

        stage('Install deps & test') {
            steps {
                sh 'npm install'
                sh 'npm test --if-present'
            }
        }

        stage('Analyse SonarQube') {
            steps {
                withSonarQubeEnv("${SONARQUBE}") {
                    sh "sonar-scanner -Dsonar.projectKey=frontend -Dsonar.sources=. -Dsonar.host.url=http://localhost:9005 -Dsonar.login=${sonar-token}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_HUB_NAMESPACE}/${IMAGE_NAME}:latest ."
            }
        }

        stage('Push Docker Image') {
            steps {
                docker.withRegistry('https://index.docker.io/v1/', DOCKER_HUB_CREDENTIALS) {
                    docker.image("${DOCKER_HUB_NAMESPACE}/${IMAGE_NAME}:latest").push()
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
