pipeline {
    agent any  // Changed from 'none' to 'any' to fix node context errors

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
                    ]]
                ])
            }
        }

        stage('Build & Test') {
            agent {
                docker {
                    image 'node:18-bullseye'  // Using standard Node image instead of bitnami
                    args '--shm-size=1gb -v /tmp/.X11-unix:/tmp/.X11-unix -u root'
                    reuseNode true
                }
            }
            stages {
                stage('Setup Environment') {
                    steps {
                        sh '''
                            # Install Chrome
                            apt-get update && apt-get install -y --no-install-recommends \
                                wget gnupg xvfb libgconf-2-4 libxtst6 libxss1 \
                                libnss3 libasound2 fonts-liberation

                            wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
                            echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
                            apt-get update && apt-get install -y google-chrome-stable

                            # Verify installations
                            google-chrome --version
                            node --version
                            npm --version
                        '''
                    }
                }

                stage('Install Dependencies') {
                    steps {
                        sh '''
                            npm install -g @angular/cli@latest sonarqube-scanner
                            npm ci --no-audit --prefer-offline --unsafe-perm
                        '''
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

                                    for app in host-app auth-app report-app collaboration-app ressource-app task-app member-app event-app; do
                                        if [ -d "projects/$app" ]; then
                                            ng test $app --watch=false --browsers=ChromeHeadless --code-coverage || true
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
                            for app in host-app auth-app report-app collaboration-app ressource-app task-app member-app event-app; do
                                if [ -d "projects/$app" ]; then
                                    ng build $app --configuration production --source-map=false
                                fi
                            done
                        '''
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            agent any
            environment {
                SONAR_TOKEN = credentials('sonarqube-token')
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        cat <<EOT > sonar-project.properties
                        sonar.projectKey=frontend-microfrontends
                        sonar.projectName=Microfrontend Platform
                        sonar.projectVersion=${BUILD_NUMBER}
                        sonar.sources=projects
                        sonar.tests=projects
                        sonar.sourceEncoding=UTF-8
                        sonar.exclusions=**/node_modules/**,**/dist/**,**/*.json,**/environments/*.ts
                        sonar.test.inclusions=**/*.spec.ts
                        sonar.typescript.lcov.reportPaths=coverage/lcov.info
                        EOT

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
            agent any
            environment {
                DOCKER_CREDS = credentials('docker-hub-credentials')
            }
            steps {
                script {
                    def apps = ['host-app', 'auth-app', 'report-app', 'collaboration-app', 'ressource-app', 'task-app', 'member-app', 'event-app']
                    
                    apps.each { app ->
                        if (fileExists("projects/${app}")) {
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
                        URL: ${env.BUILD_URL}""",
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