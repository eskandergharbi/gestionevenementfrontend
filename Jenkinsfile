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
                
                // Verify the checkout worked
                sh 'ls -la'
            }
        }

        stage('Verify Structure') {
            steps {
                script {
                    if (!fileExists('package.json')) {
                        error("package.json not found! Found files: ${sh(script: 'ls -la', returnStdout: true)}")
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
                    echo "Current directory: $(pwd)"
                    echo "Files in directory:"
                    ls -la
                    
                    npm install -g @angular/cli@latest sonarqube-scanner
                    npm install
                '''
            }
        }

        // Rest of your pipeline stages...
    }
}