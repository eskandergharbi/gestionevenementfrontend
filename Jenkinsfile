pipeline {
    agent {
        docker {
            image 'node:18-bullseye'  // Use Debian-based image for Chrome
            args '--privileged -u root'  // Privileged mode for Chrome
        }
    }

    environment {
        CHROME_BIN = '/usr/bin/google-chrome'
        SONARQUBE = 'SonarQube'
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub')
        DOCKER_HUB_NAMESPACE = 'eskandergharbi'
        IMAGE_NAME = 'gestionevenementfrontend'
    }

    stages {
        stage('Setup Chrome') {
            steps {
                sh '''
                    apt-get update
                    apt-get install -y wget gnupg
                    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
                    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
                    apt-get update
                    apt-get install -y google-chrome-stable
                '''
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/eskandergharbi/gestionevenementfrontend.git'
            }
        }

        stage('Install deps & test') {
            steps {
                sh 'npm install -g @angular/cli'
                sh 'npm install'
                
                // Fix PrimeNG imports first
                sh '''
                    sed -i "s|~primeng/resources/primeng.css|~primeng/resources/themes/saga-blue/theme.css|g" projects/host-app/src/styles.css
                    sed -i "s|~primeng/resources/primeng.css|~primeng/resources/primeng.min.css|g" projects/host-app/src/styles.css
                '''
                
                // Update tsconfig.spec.json
                sh '''
                    echo '{
                      "extends": "./tsconfig.json",
                      "compilerOptions": {
                        "outDir": "./out-tsc/spec",
                        "types": ["jasmine", "node"]
                      },
                      "include": [
                        "src/**/*.spec.ts",
                        "src/**/*.d.ts",
                        "projects/**/*.spec.ts",
                        "projects/**/*.d.ts"
                      ]
                    }' > tsconfig.spec.json
                '''
                
                sh 'ng test --browsers=ChromeHeadless --watch=false'
            }
        }

        // Rest of your stages remain the same...
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