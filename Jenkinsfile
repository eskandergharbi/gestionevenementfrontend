pipeline {
    agent none

    environment {
        CHROME_BIN = '/usr/bin/google-chrome'
        DISPLAY = ':99'
        NG_CLI_ANALYTICS = 'false'
        DOCKER_REGISTRY = 'eskandergharbi' // À adapter
        SONARQUBE_URL = 'http://sonarqube:9200' // À adapter
    }

    stages {
        stage('Checkout Code') {
            agent any
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: 'main']],
                    extensions: [[$class: 'CleanCheckout']],
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
                    image 'node:18-bullseye'
                    args '--shm-size=1gb --ipc=shared -v /tmp/.X11-unix:/tmp/.X11-unix'
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
                            rm -rf /var/lib/apt/lists/*

                            wget -q -O /tmp/google-key.pub https://dl-ssl.google.com/linux/linux_signing_key.pub
                            apt-key add /tmp/google-key.pub
                            echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
                            apt-get update && apt-get install -y google-chrome-stable
                            rm -rf /var/lib/apt/lists/*
                        '''
                    }
                }

                stage('Install Dependencies') {
                    steps {
                        sh '''
                            npm install -g @angular/cli sonarqube-scanner
                            npm ci --no-audit --prefer-offline
                        '''
                    }
                }

                stage('Run Tests') {
                    steps {
                        script {
                            try {
                                sh '''
                                    Xvfb :99 -screen 0 1024x768x24 -ac +extension GLX +render -noreset &
                                    XVFB_PID=$!

                                    export CHROME_BIN=/usr/bin/google-chrome
                                    export CHROME_HEADLESS=true

                                    # Run tests for all microfrontends
                                    for app in host-app auth-app report-app collaboration-app ressource-app task-app member-app event-app; do
                                        if [ -d "projects/$app" ]; then
                                            ng test $app --watch=false --browsers=ChromeHeadless --no-progress \
                                                --code-coverage --source-map=false \
                                                --no-sandbox --disable-gpu --disable-dev-shm-usage || true
                                        fi
                                    done
                                '''
                            } finally {
                                sh 'pkill -f Xvfb || true'
                            }
                        }
                    }
                }

                stage('Build Applications') {
                    steps {
                        sh '''
                            # Build all microfrontends
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
                        # Generate sonar-project.properties dynamically
                        cat <<EOT > sonar-project.properties
                        sonar.projectKey=frontend-microfrontends
                        sonar.projectName=Microfrontend Platform
                        sonar.projectVersion=\${BUILD_NUMBER}
                        sonar.sources=projects
                        sonar.tests=projects
                        sonar.sourceEncoding=UTF-8
                        sonar.exclusions=**/node_modules/**,**/dist/**,**/*.json,**/environment*.ts
                        sonar.test.inclusions=**/*.spec.ts
                        sonar.typescript.lcov.reportPaths=coverage/lcov.info
                        sonar.modules=host-module,auth-module,report-module,collaboration-module,ressource-module,task-module,member-module,event-module

                        # Host App
                        host-module.sonar.projectKey=host-app
                        host-module.sonar.projectName=Host App
                        host-module.sonar.sources=projects/host-app/src
                        host-module.sonar.tests=projects/host-app/src

                        # Auth App
                        auth-module.sonar.projectKey=auth-app
                        auth-module.sonar.projectName=Auth App
                        auth-module.sonar.sources=projects/auth-app/src
                        auth-module.sonar.tests=projects/auth-app/src

                        # Add other modules similarly...
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

        stage('Build & Push Docker Images') {
            agent { label 'docker' }
            environment {
                DOCKER_CREDS = credentials('docker-hub-credentials')
            }
            steps {
                script {
                    def apps = ['host-app', 'auth-app', 'report-app', 'collaboration-app', 'ressource-app', 'task-app', 'member-app', 'event-app']
                    
                    apps.each { app ->
                        if (fileExists("projects/${app}")) {
                            stage("Build ${app}") {
                                sh """
                                    docker build \
                                        -t ${DOCKER_REGISTRY}/${app}:${BUILD_NUMBER} \
                                        -t ${DOCKER_REGISTRY}/${app}:latest \
                                        --build-arg APP_NAME=${app} \
                                        -f Dockerfile.${app} .
                                    
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
            archiveArtifacts artifacts: '**/dist/**/*,coverage/**/*', allowEmptyArchive: true
            junit '**/test-results.xml'
            cleanWs(deleteDirs: true)
        }
        success {
            slackSend(color: 'good', message: "Build ${currentBuild.currentResult}: Job ${env.JOB_NAME} #${env.BUILD_NUMBER}")
        }
        failure {
            slackSend(color: 'danger', message: "Build ${currentBuild.currentResult}: Job ${env.JOB_NAME} #${env.BUILD_NUMBER}")
        }
    }
}