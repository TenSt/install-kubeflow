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
  let i = 0
  let msg = path
  while (i < args.length) {
    msg = msg + " " + args[i]
  }
  const toolRunner = new ToolRunner(path, args);
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
  args = ['init', '${KFAPP}', '--config=${CONFIG}', '-V'];
  await commandRun('./kfctl', args);
  await exec.exec('cd ${KFAPP}')
  args = ['generate', 'all', '-V'];
  await commandRun('./kfctl', args);
  args = ['apply', 'all', '-V'];
  await commandRun('./kfctl', args);
}

run();