pipeline {
    agent {
        docker {
            image 'node:18-bullseye' // Using Debian-based image for Chrome
            args '--privileged -u root' // Privileged mode for Chrome
            reuseNode true // Reuse the workspace
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
        stage('Setup Environment') {
            steps {
                sh '''
                    # Install Chrome
                    apt-get update
                    apt-get install -y wget gnupg
                    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
                    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
                    apt-get update
                    apt-get install -y google-chrome-stable

                    # Verify installations
                    node --version
                    npm --version
                    google-chrome --version
                '''
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/eskandergharbi/gestionevenementfrontend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install -g @angular/cli'
                sh 'npm install'
                
                // Fix PrimeNG CSS imports
                sh '''
                    if [ -f "projects/host-app/src/styles.css" ]; then
                        sed -i "s|~primeng/resources/primeng.css|~primeng/resources/themes/saga-blue/theme.css|g" projects/host-app/src/styles.css
                        sed -i "/~primeng\\/resources\\/themes\\/saga-blue\\/theme.css/a @import '~primeng/resources/primeng.min.css';" projects/host-app/src/styles.css
                    fi
                '''
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Update tsconfig.spec.json if needed
                    def tsConfig = readJSON file: 'tsconfig.spec.json'
                    if (!tsConfig.include.contains('projects/**/*.spec.ts')) {
                        tsConfig.include += ['projects/**/*.spec.ts', 'projects/**/*.d.ts']
                        writeJSON file: 'tsconfig.spec.json', json: tsConfig, pretty: 4
                    }

                    // Run tests with ChromeHeadless
                    sh 'ng test --browsers=ChromeHeadless --watch=false --code-coverage'
                }
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
            script {
                // Archive test results if they exist
                junit '**/test-results.xml'
            }
        }
    }
}