pipeline {
    agent none

    environment {
        CHROME_BIN = '/usr/bin/google-chrome'
        DISPLAY = ':99'
        NG_CLI_ANALYTICS = 'false'
        DOCKER_REGISTRY = 'eskandergharbi' // Remplacez par votre namespace Docker Hub
        SONARQUBE_URL = 'http://sonarqube:9200' // À adapter selon votre configuration
    }

    stages {
        stage('Récupération du code') {
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

        stage('Build & Tests') {
            agent {
                docker {
                    image 'node:18-bullseye'
                    args '--shm-size=1gb --ipc=shared -v /tmp/.X11-unix:/tmp/.X11-unix'
                    reuseNode true
                }
            }

            stages {
                stage('Installation de Chrome') {
                    steps {
                        sh '''
                            apt-get update && apt-get install -y --no-install-recommends \
                                wget gnupg xvfb libgconf-2-4 libxtst6 libxss1 \
                                libnss3 libasound2 fonts-liberation curl

                            curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
                            echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
                            apt-get update && apt-get install -y google-chrome-stable
                        '''
                    }
                }

                stage('Installation des dépendances') {
                    steps {
                        sh '''
                            npm install -g @angular/cli sonarqube-scanner
                            npm ci --no-audit --prefer-offline
                        '''
                    }
                }

                stage('Exécution des tests') {
                    steps {
                        script {
                            try {
                                sh '''
                                    Xvfb :99 -screen 0 1024x768x24 -ac &

                                    export CHROME_BIN=/usr/bin/google-chrome

                                    for app in host-app auth-app report-app collaboration-app ressource-app task-app member-app event-app; do
                                        if [ -d "projects/$app" ]; then
                                            ng test $app --watch=false --browsers=ChromeHeadless \
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

                stage('Build des applications') {
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

        stage('Analyse SonarQube') {
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
                        sonar.modules=host-module,auth-module,report-module,collaboration-module,ressource-module,task-module,member-module,event-module

                        host-module.sonar.projectKey=host-app
                        host-module.sonar.sources=projects/host-app/src
                        host-module.sonar.tests=projects/host-app/src

                        auth-module.sonar.projectKey=auth-app
                        auth-module.sonar.sources=projects/auth-app/src
                        auth-module.sonar.tests=projects/auth-app/src

                        # Ajouter les autres modules de manière similaire...
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

        stage('Build & Push Docker') {
            agent { label 'docker' }
            environment {
                DOCKER_CREDS = credentials('docker-hub-credentials')
            }
            steps {
                script {
                    def apps = ['host-app', 'auth-app', 'report-app', 'collaboration-app', 'ressource-app', 'task-app', 'member-app', 'event-app']

                    apps.each { app ->
                        if (fileExists("projects/${app}")) {
                            stage("Docker Build ${app}") {
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
            archiveArtifacts artifacts: '**/dist/**/*, coverage/**/*', allowEmptyArchive: true
            junit '**/test-results.xml'
            cleanWs(deleteDirs: true)
        }
        success {
            slackSend(color: 'good', message: "✅ Build réussi : Job ${env.JOB_NAME} #${env.BUILD_NUMBER}")
        }
        failure {
            slackSend(color: 'danger', message: "❌ Build échoué : Job ${env.JOB_NAME} #${env.BUILD_NUMBER}")
        }
    }
}
