"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const update_config_1 = require("../../utils/config/update-config");
const functions_1 = require("../../utils/config/functions");
function updateRootJestConfig() {
    return (host, context) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const workspace = yield workspace_1.getWorkspace(host);
        const rootDirs = [];
        for (const [projectName, project] of workspace.projects) {
            for (const [, target] of project.targets) {
                if (target.builder !== '@nrwl/jest:jest') {
                    continue;
                }
                rootDirs.push(`<rootDir>/${project.root}`);
                try {
                    update_config_1.addPropertyToJestConfig(host, target.options.jestConfig, 'preset', `${workspace_1.offsetFromRoot(project.root)}jest.preset.js`);
                    update_config_1.addPropertyToJestConfig(host, target.options.jestConfig, 'displayName', projectName);
                    update_config_1.removePropertyFromJestConfig(host, target.options.jestConfig, 'name');
                }
                catch (_a) {
                    context.logger.error(`Unable to update the jest preset for project ${projectName}. Please manually add "@nrwl/jest/preset" as the preset.`);
                }
            }
        }
        if (rootDirs.length == 0) {
            return;
        }
        else {
            try {
                context.logger.info(`
The root jest.config.js file will be updated to include all references to each individual project's jest config. 
A new jest.preset.js file will be created that would have your existing configuration. All projects will now have this preset.
        `);
                let existingRootConfig = host.read('jest.config.js').toString('utf-8');
                existingRootConfig =
                    "const nxPreset = require('@nrwl/jest/preset'); \n" +
                        existingRootConfig;
                const presetPath = 'jest.preset.js';
                host.create(presetPath, existingRootConfig);
                const configObject = functions_1.jestConfigObjectAst(host, presetPath);
                workspace_1.insert(host, presetPath, [
                    new workspace_1.InsertChange(presetPath, configObject.getStart() + 1, '\n...nxPreset,'),
                ]);
                host.overwrite('jest.config.js', `
        module.exports = {
          projects: ${workspace_1.serializeJson(rootDirs)}
        }
        `);
            }
            catch (_b) {
                context.logger.error(`
Unable to update the root jest.config.js with projects. Please add the "projects" property to the exported jest config with the following:
${workspace_1.serializeJson(rootDirs)}
        `);
            }
        }
    });
}
function update() {
    return schematics_1.chain([updateRootJestConfig(), workspace_1.formatFiles()]);
}
exports.default = update;
//# sourceMappingURL=update-projects-property.js.map