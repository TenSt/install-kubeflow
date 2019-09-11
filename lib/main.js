"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
//import * as exec from '@actions/exec';
const toolrunner_1 = require("@actions/exec/lib/toolrunner");
function getInputs() {
    return __awaiter(this, void 0, void 0, function* () {
        const config = core.getInput('config');
        const username = core.getInput('username', { required: true });
        const password = core.getInput('password', { required: true });
        core.exportVariable('KFAPP', 'kubeflow');
        core.exportVariable('CONFIG', config);
        core.exportVariable('KUBEFLOW_USER_EMAIL', username);
        core.exportVariable('KUBEFLOW_PASSWORD', password);
    });
}
function commandRun(path, args) {
    return __awaiter(this, void 0, void 0, function* () {
        let msg = "  " + path;
        for (let index = 0; index < args.length; index++) {
            msg = msg + " " + args[index];
        }
        let cwd = '/home/runner/work/install-kubeflow/install-kubeflow';
        if (path == '../kfctl') {
            cwd = '/home/runner/work/install-kubeflow/install-kubeflow/kubeflow';
        }
        args = ['.'];
        yield commandRun('pwd', args);
        const toolRunner = new toolrunner_1.ToolRunner(path, args, { cwd: cwd });
        core.debug(msg);
        const code = yield toolRunner.exec();
        if (code != 0) {
            throw new Error('Command: \n' + msg + '\nFAILED.');
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let args = ['https://github.com/kubeflow/kubeflow/releases/download/v0.6.2/kfctl_v0.6.2_linux.tar.gz'];
        yield commandRun('wget', args);
        args = ['-xvf', 'kfctl_v0.6.2_linux.tar.gz'];
        yield commandRun('tar', args);
        getInputs();
        args = ['cluster-info'];
        yield commandRun('kubectl', args);
        let kfapp = 'kubeflow';
        let config = '--config=' + core.getInput('config');
        args = ['init', kfapp, config, '-V'];
        yield commandRun('./kfctl', args);
        args = ['-lsa'];
        yield commandRun('ls', args);
        args = ['.'];
        yield commandRun('pwd', args);
        args = ['generate', 'all', '-V'];
        yield commandRun('../kfctl', args);
        // args = ['apply', 'all', '-V'];
        // await commandRun('../kfctl', args);
    });
}
run();
