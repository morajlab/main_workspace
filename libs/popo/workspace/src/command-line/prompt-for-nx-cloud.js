"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForNxCloud = void 0;
const tslib_1 = require("tslib");
const inquirer = require("inquirer");
const file_utils_1 = require("../core/file-utils");
const output_1 = require("../utils/output");
const detect_package_manager_1 = require("../utils/detect-package-manager");
const child_process_1 = require("child_process");
function promptForNxCloud(scan) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!scan)
            return;
        const nxJson = file_utils_1.readNxJson();
        const nxCloudRunnerIsUsed = Object.values(nxJson.tasksRunnerOptions).find((r) => r.runner == '@nrwl/nx-cloud');
        if (nxCloudRunnerIsUsed)
            return;
        const res = yield askAboutNxCloud();
        if (res) {
            const pm = detect_package_manager_1.detectPackageManager();
            child_process_1.execSync(`${detect_package_manager_1.getPackageManagerInstallCommand(pm, true)} @nrwl/nx-cloud@latest`);
            child_process_1.execSync(`${detect_package_manager_1.getPackageManagerExecuteCommand(pm)} nx g @nrwl/nx-cloud:init`, {
                stdio: [0, 1, 2],
            });
        }
        else {
            output_1.output.log({ title: 'Executing the command without --scan' });
        }
    });
}
exports.promptForNxCloud = promptForNxCloud;
function askAboutNxCloud() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        output_1.output.log({
            title: '--scan requires the workspace to be connected to Nx Cloud.',
        });
        return inquirer
            .prompt([
            {
                name: 'NxCloud',
                message: `Use Nx Cloud? (It's free and doesn't require registration.)`,
                type: 'list',
                choices: [
                    {
                        value: 'yes',
                        name: 'Yes [Faster builds, run details, Github integration. Learn more at https://nx.app]',
                    },
                    {
                        value: 'no',
                        name: 'No',
                    },
                ],
                default: 'no',
            },
        ])
            .then((a) => a.NxCloud === 'yes');
    });
}
//# sourceMappingURL=prompt-for-nx-cloud.js.map