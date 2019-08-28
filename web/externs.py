import json
import os
import time

import jenkins


jenkins_url = os.environ.get('JENKINS_URL')
jenkins_un = os.environ.get('JENKINS_USERNAME')
jenkins_pw = os.environ.get('JENKINS_PASSWORD')
jenkins_params = json.loads(os.environ.get('JENKINS_PARAMS'))
server = jenkins.Jenkins(jenkins_url, username=jenkins_un, password=jenkins_pw)


def deploy_local_swarm_service(service='notification'):
    try:
        server.build_job(f'deploy-local-swarm-{service}', parameters=jenkins_params)
        time.sleep(10)
    except Exception as e:
        print(f'failed to deploy {service} service\nerror: {e}')
