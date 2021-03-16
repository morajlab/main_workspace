"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const path_1 = require("path");
const updatePackages = workspace_1.updatePackagesInPackageJson(path_1.join(__dirname, '../../..', 'migrations.json'), '10.3.0');
const addLintRule = (host) => {
    return host.exists('.eslintrc')
        ? workspace_1.updateJsonInTree('.eslintrc', (json) => {
            json.rules = json.rules || {};
            json.rules['@typescript-eslint/explicit-module-boundary-types'] = 'off';
            return json;
        })
        : schematics_1.noop();
};
function default_1() {
    return schematics_1.chain([updatePackages, addLintRule, workspace_1.formatFiles()]);
}
exports.default = default_1;
//# sourceMappingURL=update-10-3-0.js.map