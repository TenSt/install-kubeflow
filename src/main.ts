import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { ToolRunner } from "@actions/exec/lib/toolrunner";

async function getInputs() {
  const config = core.getInput('config');
  const username = core.getInput('username', { required: true });
  const password = core.getInput('password', { required: true });
  core.exportVariable('KFAPP', 'kubeflow');
  core.exportVariable('CONFIG', config);
  core.exportVariable('KUBEFLOW_USER_EMAIL', username);
  core.exportVariable('KUBEFLOW_PASSWORD', password);
}

async function commandRun(path: string ,args: string[]) {
  let msg = "  " + path;
  for (let index = 0; index < args.length; index++) {
    msg = msg + " " + args[index];
  }
  let cwd = '/home/runner/work/install-kubeflow/install-kubeflow';
  if (path == '../kfctl') {
    cwd = '/home/runner/work/install-kubeflow/install-kubeflow/kubeflow';
  }
  const toolRunner = new ToolRunner(path, args, {cwd: cwd});
  core.debug(msg);
  const code = await toolRunner.exec();
  if (code != 0) {
      throw new Error('Command: \n' + msg + '\nFAILED.')
  }
}

async function run() {
  let args = ['https://github.com/kubeflow/kubeflow/releases/download/v0.6.2/kfctl_v0.6.2_linux.tar.gz'];
  await commandRun('wget', args);
  args = ['-xvf', 'kfctl_v0.6.2_linux.tar.gz'];
  await commandRun('tar', args);
  getInputs()
  args = ['cluster-info'];
  await commandRun('kubectl', args);
  await exec.exec('kubectl create namespace kubeflow-anonymous --dry-run -o yaml > ns.yaml')
  // args = ['create', 'namespace', 'kubeflow-anonymous', '--dry-run', '-o', 'yaml', '>', 'ns.yaml'];
  // await commandRun('kubectl', args);
  args = ['apply', '-f', 'ns.yaml'];
  await commandRun('kubectl', args);
  let kfapp = 'kubeflow';
  let config = '--config=' + core.getInput('config');
  args = ['init', kfapp, config, '-V'];
  await commandRun('./kfctl', args);
  args = ['generate', 'all', '-V'];
  await commandRun('../kfctl', args);
  args = ['apply', 'all', '-V'];
  await commandRun('../kfctl', args);
}

run();