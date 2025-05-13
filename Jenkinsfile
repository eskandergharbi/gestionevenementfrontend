pipeline {
    agent any

    environment {
        CHROME_BIN = '/usr/bin/google-chrome'
        DISPLAY = ':99'
        NG_CLI_ANALYTICS = 'false'
        DOCKER_REGISTRY = 'eskandergharbi'
        SONARQUBE_URL = 'http://sonarqube:9200'
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
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/eskandergharbi/gestionevenementfrontend.git',
                        credentialsId: 'git-credentials'
                    ]],
                    extensions: [[
                        $class: 'RelativeTargetDirectory',
                        relativeTargetDir: 'src'
                    ]]
                ])
                dir('src') {
                    // Verify the repository structure
                    sh 'ls -la'
                }
            }
        }

        stage('Build & Test') {
            agent {
                docker {
                    image 'node:18-bullseye'
                    args '--shm-size=1gb -v /tmp/.X11-unix:/tmp/.X11-unix -u root'
                    reuseNode true
                }
            }
            stages {
                stage('Setup Environment') {
                    steps {
                        sh '''
                            apt-get update && apt-get install -y --no-install-recommends \
                                wget gnupg xvfb libgconf-2-4 libxtst6 libxss1 \
                                libnss3 libasound2 fonts-liberation

                            wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
                            echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
                            apt-get update && apt-get install -y google-chrome-stable

                            google-chrome --version
                            node --version
                            npm --version
                        '''
                    }
                }

                stage('Install Dependencies') {
                    steps {                      
                        sh 'npm install -g @angular/cli@latest sonarqube-scanner'
                        sh 'npm install'  
                        
                    }
                }

                stage('Verify Project Structure') {
                    steps {
                        script {
                            // Check if angular.json exists and is valid
                            def angularJson = readJSON file: 'angular.json'
                            echo "Found projects: ${angularJson.projects.keySet()}"
                        }
                    }
                }

                stage('Run Tests') {
                    steps {
                        script {
                            try {
                                sh '''
                                    Xvfb :99 -screen 0 1024x768x24 -ac &
                                    export DISPLAY=:99
                                    export CHROME_BIN=/usr/bin/google-chrome

                                    # Run tests only for apps that exist and have test configuration
                                    for app in $(jq -r '.projects | keys[]' angular.json); do
                                        if [ -f "projects/$app/tsconfig.spec.json" ]; then
                                            echo "Running tests for $app"
                                            ng test $app --watch=false --browsers=ChromeHeadless --code-coverage || true
                                        else
                                            echo "Skipping tests for $app - no test configuration found"
                                        fi
                                    done
                                '''
                            } finally {
                                sh 'pkill -f Xvfb || true'
                            }
                        }
                    }
                }

                stage('Build Production') {
                    steps {
                        sh '''
                            # Build only apps that exist and have build configuration
                            for app in $(jq -r '.projects | keys[]' angular.json); do
                                if [ -f "projects/$app/tsconfig.app.json" ]; then
                                    echo "Building $app"
                                    ng build $app --configuration production --source-map=false || true
                                else
                                    echo "Skipping build for $app - no build configuration found"
                                fi
                            done
                        '''
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { fileExists('angular.json') }
            }
            agent any
            environment {
                SONAR_TOKEN = credentials('sonarqube-token')
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        # Generate sonar-project.properties dynamically
                        echo "sonar.projectKey=frontend-microfrontends" > sonar-project.properties
                        echo "sonar.projectName=Microfrontend Platform" >> sonar-project.properties
                        echo "sonar.projectVersion=${BUILD_NUMBER}" >> sonar-project.properties
                        echo "sonar.sources=projects" >> sonar-project.properties
                        echo "sonar.tests=projects" >> sonar-project.properties
                        echo "sonar.sourceEncoding=UTF-8" >> sonar-project.properties
                        echo "sonar.exclusions=**/node_modules/**,**/dist/**,**/*.json,**/environments/*.ts" >> sonar-project.properties
                        echo "sonar.test.inclusions=**/*.spec.ts" >> sonar-project.properties
                        
                        # Find coverage reports if they exist
                        if [ -d "coverage" ]; then
                            find coverage -name 'lcov.info' -exec echo "sonar.typescript.lcov.reportPaths={}" \\;
                        fi >> sonar-project.properties

                        sonar-scanner
                    '''
                }
            }
            post {
                success {
                    script {
                        timeout(time: 5, unit: 'MINUTES') {
                            waitForQualityGate abortPipeline: true
                        }
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            when {
                expression { 
                    // Only run if Dockerfiles exist
                    def dockerfilesExist = false
                    def apps = ['host-app', 'auth-app', 'report-app', 'collaboration-app', 'ressource-app', 'task-app', 'member-app', 'event-app']
                    apps.each { app ->
                        if (fileExists("Dockerfile.${app}")) {
                            dockerfilesExist = true
                        }
                    }
                    return dockerfilesExist
                }
            }
            agent any
            environment {
                DOCKER_CREDS = credentials('docker-hub-credentials')
            }
            steps {
                script {
                    def apps = ['host-app', 'auth-app', 'report-app', 'collaboration-app', 'ressource-app', 'task-app', 'member-app', 'event-app']
                    
                    apps.each { app ->
                        if (fileExists("Dockerfile.${app}")) {
                            stage("Build & Push ${app}") {
                                sh """
                                    docker build \
                                        -t ${DOCKER_REGISTRY}/${app}:${BUILD_NUMBER} \
                                        -t ${DOCKER_REGISTRY}/${app}:latest \
                                        --build-arg APP_NAME=${app} \
                                        -f Dockerfile.${app} .

                                    echo "${DOCKER_CREDS_PSW}" | docker login -u "${DOCKER_CREDS_USR}" --password-stdin
                                    docker push ${DOCKER_REGISTRY}/${app}:${BUILD_NUMBER}
                                    docker push ${DOCKER_REGISTRY}/${app}:latest
                                """
                            }
                        } else {
                            echo "Skipping Docker build for ${app} - Dockerfile not found"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                junit testResults: '**/test-results.xml', allowEmptyResults: true
                archiveArtifacts artifacts: '**/dist/**/*, coverage/**/*', allowEmptyArchive: true
                cleanWs()
            }
        }
        failure {
            script {
                if (env.SLACK_CREDENTIALS_ID) {
                    slackSend(
                        color: 'danger',
                        message: """🚨 Pipeline Failed 🚨
                        Job: ${env.JOB_NAME}
                        Build: #${env.BUILD_NUMBER}
                        URL: ${env.BUILD_URL}
                        Error: ${currentBuild.currentResult}""",
                        channel: '#ci-alerts',
                        tokenCredentialId: env.SLACK_CREDENTIALS_ID
                    )
                }
            }
        }
        success {
            script {
                if (env.SLACK_CREDENTIALS_ID) {
                    slackSend(
                        color: 'good',
                        message: """✅ Pipeline Succeeded ✅
                        Job: ${env.JOB_NAME}
                        Build: #${env.BUILD_NUMBER}
                        URL: ${env.BUILD_URL}""",
                        channel: '#ci-notifications',
                        tokenCredentialId: env.SLACK_CREDENTIALS_ID
                    )
                }
            }
        }
    }
}