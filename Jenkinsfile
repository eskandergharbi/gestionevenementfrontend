pipeline {
    agent any
     tools {
        nodejs 'NodeJS-18' // Nom exact configuré dans Jenkins
    }

    environment {
        SONARQUBE = 'SonarQube'
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub') // Remplace par l'ID réel de ton secret dans Jenkins
        DOCKER_HUB_NAMESPACE = 'eskandergharbi'
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
                sh 'npm install -g @angular/cli'  // Install Angular CLI globall
                sh 'npm install'
                sh 'npm test --if-present'
            }
        }

        stage('Analyse SonarQube') {
            steps {
                withSonarQubeEnv("${SONARQUBE}") {
                    sh "sonar-scanner -Dsonar.projectKey=frontend -Dsonar.sources=. -Dsonar.host.url=http://localhost:9005 -Dsonar.login=${SONARQUBE_TOKEN}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_HUB_NAMESPACE}/${IMAGE_NAME}:latest")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_HUB_CREDENTIALS) {
                        dockerImage.push('latest')
                    }
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
