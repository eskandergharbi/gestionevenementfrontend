pipeline {
    agent {
        docker {
            image 'node:18-bullseye'
            args '--shm-size=1gb --ipc=shared'
            reuseNode true
        }
    }

    environment {
        CHROME_BIN = '/usr/bin/google-chrome'
        DISPLAY = ':99'
        NG_CLI_ANALYTICS = 'false'
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
                    
                    echo "Node: $(node --version)"
                    echo "NPM: $(npm --version)"
                    echo "Chrome: $(google-chrome --version)"
                '''
            }
        }

        stage('Checkout Code') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: 'main']],
                    extensions: [[$class: 'CleanCheckout']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/eskandergharbi/gestionevenementfrontend.git'
                    ]]
                ])
            }
        }

        stage('Fix Configuration') {
            steps {
                sh '''
                    apt-get update && apt-get install -y jq && rm -rf /var/lib/apt/lists/*
                    
                    for css in projects/*/src/styles.css; do
                        [ -f "$css" ] && sed -i 's|~primeng/resources/primeng.css|~primeng/resources/themes/lara-light-blue/theme.css|g' "$css"
                        [ -f "$css" ] && echo "@import '~primeng/resources/primeng.min.css';" >> "$css"
                    done
                    
                    for tsconfig in projects/*/tsconfig.spec.json; do
                        [ -f "$tsconfig" ] && jq '.include += ["**/*.spec.ts", "**/*.d.ts"]' "$tsconfig" > "${tsconfig}.tmp" && \
                        mv "${tsconfig}.tmp" "$tsconfig"
                    done
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm install -g @angular/cli
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
                            
                            ng test host-app --watch=false --browsers=ChromeHeadless --no-progress \
                                --code-coverage --source-map=false \
                                --no-sandbox --disable-gpu --disable-dev-shm-usage
                            ng test auth-app --watch=false --browsers=ChromeHeadless --no-progress \
                                --code-coverage --source-map=false \
                                --no-sandbox --disable-gpu --disable-dev-shm-usage
                            ng test report-app --watch=false --browsers=ChromeHeadless --no-progress \
                                --code-coverage --source-map=false \
                                --no-sandbox --disable-gpu --disable-dev-shm-usage
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
                    ng build host-app --configuration production --source-map=false
                    ng build auth-app --configuration production --source-map=false
                    ng build report-app --configuration production --source-map=false
                '''
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { return env.SONARQUBE_TOKEN != null }
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                            -Dsonar.projectKey=frontend \
                            -Dsonar.sources=projects \
                            -Dsonar.host.url=http://localhost:9005 \
                            -Dsonar.login=${SONARQUBE_TOKEN} \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            when {
                expression { return env.DOCKER_USER != null && env.DOCKER_PASS != null }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin
                        docker build -t eskandergharbi/host-app:latest --build-arg APP_NAME=host-app .
                        docker push eskandergharbi/host-app:latest
                    '''
                }
            }
        }

        stage('Archive Results') {
            steps {
                junit '**/test-results.xml'
                archiveArtifacts artifacts: '**/dist/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}