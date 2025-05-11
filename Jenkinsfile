pipeline {
    agent {
        docker {
            image 'node:18-bullseye' // Using Debian-based image for better compatibility
            args '--privileged -u root --shm-size=1gb' // Added shared memory for Chrome
            reuseNode true
        }
    }

    environment {
        CHROME_BIN = '/usr/bin/google-chrome'
        DISPLAY = ':99'
    }

    stages {
        stage('Setup Environment') {
            steps {
                sh '''
                    # Install Chrome and dependencies
                    apt-get update
                    apt-get install -y wget gnupg xvfb libgconf-2-4 jq
                    
                    # Install Chrome
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

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/eskandergharbi/gestionevenementfrontend.git'
            }
        }

        stage('Fix Configuration') {
            steps {
                sh '''
                    # Fix PrimeNG CSS imports in all projects
                    find projects -name "styles.css" -exec sed -i "s|~primeng/resources/primeng.css|~primeng/resources/themes/lara-light-blue/theme.css|g" {} \\;
                    find projects -name "styles.css" -exec sed -i "/~primeng\\/resources\\/themes\\/lara-light-blue\\/theme.css/a @import '~primeng/resources/primeng.min.css';" {} \\;
                    
                    # Ensure test files are included in all tsconfig.spec.json files
                    find projects -name "tsconfig.spec.json" -exec jq '.include += ["projects/**/*.spec.ts", "projects/**/*.d.ts"]' {} > tmp.json && mv tmp.json {} \\;
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install -g @angular/cli'
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    # Start Xvfb for headless testing
                    Xvfb :99 -screen 0 1024x768x24 -ac +extension GLX +render -noreset &
                    export DISPLAY=:99
                    
                    # Run tests for all applications
                    ng test host-app --watch=false --browsers=ChromeHeadless --no-progress
                    ng test auth-app --watch=false --browsers=ChromeHeadless --no-progress
                    ng test report-app --watch=false --browsers=ChromeHeadless --no-progress
                    ng test task-app --watch=false --browsers=ChromeHeadless --no-progress
                    ng test ressource-app --watch=false --browsers=ChromeHeadless --no-progress
                    ng test collaboration-app --watch=false --browsers=ChromeHeadless --no-progress
                    ng test event-app --watch=false --browsers=ChromeHeadless --no-progress
                    ng test member-app --watch=false --browsers=ChromeHeadless --no-progress
                '''
            }
        }

        stage('Build Applications') {
            steps {
                sh '''
                    # Build all applications
                    ng build host-app --configuration production
                    ng build auth-app --configuration production
                    ng build report-app --configuration production
                    ng build task-app --configuration production
                    ng build ressource-app --configuration production
                    ng build collaboration-app --configuration production
                    ng build event-app --configuration production
                    ng build member-app --configuration production
                '''
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { env.SONARQUBE_TOKEN != null }
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=frontend \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://localhost:9005 \
                        -Dsonar.login=${SONARQUBE_TOKEN} \
                        -Dsonar.exclusions=**/node_modules/**,**/*.spec.ts \
                        -Dsonar.tests=projects \
                        -Dsonar.test.inclusions=**/*.spec.ts \
                        -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def apps = [
                        'host-app',
                        'auth-app', 
                        'report-app',
                        'task-app',
                        'ressource-app',
                        'collaboration-app',
                        'event-app',
                        'member-app'
                    ]
                    
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin'
                        
                        apps.each { app ->
                            dockerImage = docker.build("eskandergharbi/${app}:latest", "--build-arg APP_NAME=${app} ./")
                            dockerImage.push('latest')
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'pkill -f Xvfb' // Clean up Xvfb process
            cleanWs()
            
            // Archive test results and coverage
            junit '**/test-results.xml'
            archiveArtifacts '**/coverage/**/*'
        }
    }
}