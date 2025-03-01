pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = "eskandergharbi"
        DOCKER_HUB_PASSWORD = credentials('docker-hub-password') // Stocké dans Jenkins
        HEROKU_API_KEY = credentials('heroku-api-key') // Stocké dans Jenkins
        HEROKU_APP_FRONTEND = "nom-de-votre-app-frontend"
    }

    stages {
        stage('Cloner le dépôt Frontend') {
            steps {
                script {
                    // Cloner uniquement le dépôt Frontend
                    sh 'git clone https://github.com/eskandergharbi/projetfederateurfrontend.git frontend'
                }
            }
        }

        stage('Installer dépendances & Tester Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh 'npm install'
                        sh 'npm run test -- --watch=false --browsers=ChromeHeadless' // Exécute les tests unitaires Angular
                    }
                }
            }
        }

        stage('Connexion à Docker Hub et Heroku') {
            steps {
                script {
                    sh 'echo $DOCKER_HUB_PASSWORD | docker login -u $DOCKER_HUB_USERNAME --password-stdin'
                    sh 'heroku container:login'
                }
            }
        }

        stage('Docker Build & Push Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh 'docker build -t $DOCKER_HUB_USERNAME/frontend-app .'
                        sh 'docker push $DOCKER_HUB_USERNAME/frontend-app'
                    }
                }
            }
        }

        stage('Déployer sur Heroku Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh 'heroku container:push web --app $HEROKU_APP_FRONTEND'
                        sh 'heroku container:release web --app $HEROKU_APP_FRONTEND'
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Déploiement du Frontend réussi sur Heroku ! 🚀"
        }
        failure {
            echo "❌ Échec du pipeline Frontend, vérifiez les logs."
        }
    }
}
