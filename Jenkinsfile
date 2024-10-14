node("slave") {
  try {
    def dockerTag = env.commitId
    def serviceName = "co-writer"
    cleanWs()
    if (dockerTag=="latest") {
        node("graviton") {
            cleanWs()
            stage("SCM") {
		checkout scm
		dockerTag = sh (
			script: "git rev-parse HEAD | cut -c1-7",
			returnStdout: true
	    	).trim()
	    println("Docker Image will be published with tag: "+dockerTag)
            }
            stage("Docker Build") {
                sh "docker build -t ${serviceName}:latest . --network=host"
            }
            stage("Docker Push") {
                sh "aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 856517911253.dkr.ecr.ap-southeast-1.amazonaws.com"
                sh "docker tag ${serviceName}:latest 856517911253.dkr.ecr.ap-southeast-1.amazonaws.com/${serviceName}:${dockerTag}"
                sh "docker push 856517911253.dkr.ecr.ap-southeast-1.amazonaws.com/${serviceName}:${dockerTag}"
                sh "docker tag 856517911253.dkr.ecr.ap-southeast-1.amazonaws.com/${serviceName}:${dockerTag} 856517911253.dkr.ecr.ap-southeast-1.amazonaws.com/${serviceName}:latest"
                sh "docker push 856517911253.dkr.ecr.ap-southeast-1.amazonaws.com/${serviceName}:latest"
            }
            stage("Clean-up Docker Images") {
                sh 'docker system prune -f'
                sh """docker images | grep """ + serviceName + """ | awk '{print \$1":"\$2}' | xargs docker rmi"""
            }
        }
    }
    stage("Pull Helm Chart") {
        withCredentials([gitUsernamePassword(credentialsId: "Github-creds", gitToolName: "git-tool")]) {
            sh "git clone https://github.com/Pocket-Fm/infra_docs.git"
        }
    }
    stage("Deploy to Prod"){
        sh """ /usr/local/bin/helm upgrade --install --atomic --timeout 240s --set image.repository=856517911253.dkr.ecr.ap-southeast-1.amazonaws.com/${serviceName} --set image.tag=${dockerTag} --set nameOverride=${serviceName} --set fullnameOverride=${serviceName} --set service.port=3000 ${serviceName} infra_docs/helm-charts/pocketfm-web -n pocketfm-websites --kubeconfig ~/.kube/web-config """
        sh """ /usr/local/bin/kubectl get pods -n pocketfm-websites --kubeconfig ~/.kube/web-config """          
    }
    stage("Slack Notify"){
        slackSend(color: "good", message: "Marketing deployment successful (<${env.BUILD_URL}|Open>)", channel: "C01CP9Y66RZ")
    }
  }
  catch(Exception e){
    slackSend(color: "danger", message: "Marketing deployment failed (<${env.BUILD_URL}|Open>)", channel: "C01CP9Y66RZ")
    throw e
  }
}
