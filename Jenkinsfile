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
        stage('Récupération du code') {
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
                    args '--shm-size=1gb -v /tmp/.X11-unix:/tmp/.X11-unix --user root'
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
                                                --code-coverage --source-map=false
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
                        script {
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

                        report-module.sonar.projectKey=report-app
                        report-module.sonar.sources=projects/report-app/src
                        report-module.sonar.tests=projects/report-app/src

                        collaboration-module.sonar.projectKey=collaboration-app
                        collaboration-module.sonar.sources=projects/collaboration-app/src
                        collaboration-module.sonar.tests=projects/collaboration-app/src

                        ressource-module.sonar.projectKey=ressource-app
                        ressource-module.sonar.sources=projects/ressource-app/src
                        ressource-module.sonar.tests=projects/ressource-app/src

                        task-module.sonar.projectKey=task-app
                        task-module.sonar.sources=projects/task-app/src
                        task-module.sonar.tests=projects/task-app/src

                        member-module.sonar.projectKey=member-app
                        member-module.sonar.sources=projects/member-app/src
                        member-module.sonar.tests=projects/member-app/src

                        event-module.sonar.projectKey=event-app
                        event-module.sonar.sources=projects/event-app/src
                        event-module.sonar.tests=projects/event-app/src
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
            junit testResults: '**/test-results.xml', allowEmptyResults: true
            cleanWs(deleteDirs: true)
        }
        failure {
            script {
                if (env.SLACK_CREDENTIALS_ID) {
                    slackSend(
                        color: 'danger', 
                        message: "❌ Build échoué : Job ${env.JOB_NAME} #${env.BUILD_NUMBER}",
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
                        message: "✅ Build réussi : Job ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                        tokenCredentialId: env.SLACK_CREDENTIALS_ID
                    )
                }
            }
        }
    }
}