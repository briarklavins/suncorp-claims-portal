pipeline {
    agent { label 'node-20' }

    environment {
        NPM_REGISTRY = 'https://artifactory.suncorp.com.au/artifactory/api/npm/npm-virtual'
        SONAR_HOST   = 'https://sonar.suncorp.com.au'
        CHROME_BIN   = '/usr/bin/google-chrome'
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci --registry=$NPM_REGISTRY'
            }
        }
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        stage('Unit Test') {
            steps {
                sh 'npm run test -- --browsers=ChromeHeadlessNoSandbox'
            }
            post {
                always {
                    junit 'test-results/*.xml'
                }
            }
        }
        stage('Build UAT') {
            steps {
                sh 'npm run build:uat'
            }
        }
        stage('Build PROD') {
            when { branch 'master' }
            steps {
                sh 'npm run build:prod'
                archiveArtifacts artifacts: 'dist/suncorp-claims-portal/**', fingerprint: true
            }
        }
        stage('E2E') {
            when { branch 'develop' }
            steps {
                sh 'npx playwright install --with-deps chromium'
                sh 'CI=true npm run e2e'
            }
        }
    }

    post {
        failure {
            emailext to: 'pi-digital@suncorp.com.au',
                     subject: "claims-portal build ${env.BUILD_NUMBER} failed"
        }
    }
}
