"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installPackagesTask = void 0;
const child_process_1 = require("child_process");
const path_1 = require("path");
const package_manager_1 = require("@nrwl/tao/src/shared/package-manager");
const path_2 = require("../utils/path");
let storedPackageJsonValue;
/**
 * Runs `npm install` or `yarn install`. It will skip running the install if
 * `package.json` hasn't changed at all or it hasn't changed since the last invocation.
 *
 * @param host - the file system tree
 * @param alwaysRun - always run the command even if `package.json` hasn't changed.
 */
function installPackagesTask(host, alwaysRun = false, cwd = '', packageManager) {
    const packageJsonValue = host
        .read(path_2.joinPathFragments(cwd, 'package.json'))
        .toString();
    if (host
        .listChanges()
        .find((f) => f.path === path_2.joinPathFragments(cwd, 'package.json')) ||
        alwaysRun) {
        // Don't install again if install was already executed with package.json
        if (storedPackageJsonValue != packageJsonValue || alwaysRun) {
            storedPackageJsonValue = host
                .read(path_2.joinPathFragments(cwd, 'package.json'))
                .toString();
            const pm = packageManager || package_manager_1.detectPackageManager(cwd);
            const pmc = package_manager_1.getPackageManagerCommand(pm);
            child_process_1.execSync(pmc.install, {
                cwd: path_1.join(host.root, cwd),
                stdio: [0, 1, 2],
            });
        }
    }
}
exports.installPackagesTask = installPackagesTask;
//# sourceMappingURL=install-packages-task.js.map