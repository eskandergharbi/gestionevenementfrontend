pipeline {
    agent any

    environment {
        CHROME_BIN = '/usr/bin/google-chrome'
        DISPLAY = ':99'
        NG_CLI_ANALYTICS = 'false'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/eskandergharbi/gestionevenementfrontend.git',
                        credentialsId: 'git-credentials'
                    ]]
                ])
                
                // Vérifie que le checkout a fonctionné
                sh 'ls -la'
            }
        }

        stage('Verify Structure') {
            steps {
                script {
                    if (!fileExists('package.json')) {
                        error("package.json introuvable ! Fichiers présents : ${sh(script: 'ls -la', returnStdout: true)}")
                    }
                }
            }
        }

        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:18-bullseye'
                    args '--shm-size=1gb -u root'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    echo "Répertoire courant : $(pwd)"
                    echo "Fichiers présents :"
                    ls -la
                    
                    npm install -g @angular/cli@latest sonarqube-scanner
                    npm install
                '''
            }
        }

        stage('Exécuter les tests unitaires') {
            steps {
                script {
                    if (fileExists('karma.conf.js')) {
                        echo "Fichier de configuration Karma trouvé : exécution des tests..."
                        sh 'npx ng test --watch=false --browsers=ChromeHeadless --code-coverage'
                    } else {
                        echo "Aucun test unitaire trouvé (karma.conf.js manquant). Étape ignorée."
                    }
                }
            }
        }

        stage('Analyse SonarQube') {
            when {
                expression {
                    return fileExists('sonar-project.properties')
                }
            }
            environment {
                SONAR_SCANNER_OPTS = "-Dsonar.projectKey=frontend-app -Dsonar.sources=./projects -Dsonar.host.url=http://localhost:9000 -Dsonar.login=<votre-token-sonar>"
            }
            steps {
                script {
                    echo "Lancement de l'analyse SonarQube..."
                    sh 'sonar-scanner'
                }
            }
        }
    }
}
