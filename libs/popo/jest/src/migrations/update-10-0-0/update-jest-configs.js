"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const update_config_1 = require("../../utils/config/update-config");
const require_jest_config_1 = require("./require-jest-config");
const app_root_1 = require("@nrwl/workspace/src/utils/app-root");
function checkJestPropertyObject(object) {
    return object !== null && object !== undefined;
}
function modifyJestConfig(host, context, project, setupFile, jestConfig, tsConfig, isAngular) {
    let globalTsJest = {
        tsConfig,
    };
    if (isAngular) {
        globalTsJest = Object.assign(Object.assign({}, globalTsJest), { stringifyContentPathRegex: '\\.(html|svg)$', astTransformers: [
                'jest-preset-angular/build/InlineFilesTransformer',
                'jest-preset-angular/build/StripStylesTransformer',
            ] });
    }
    try {
        const jestObject = require_jest_config_1.getJestObject(`${app_root_1.appRootPath}/${jestConfig}`);
        if (setupFile !== '') {
            // add set up env file
            // setupFilesAfterEnv
            const existingSetupFiles = jestObject.setupFilesAfterEnv;
            let setupFilesAfterEnv = [setupFile];
            if (Array.isArray(existingSetupFiles)) {
                setupFilesAfterEnv = setupFile;
            }
            update_config_1.addPropertyToJestConfig(host, jestConfig, 'setupFilesAfterEnv', setupFilesAfterEnv);
        }
        // check if jest config has babel transform
        const transformProperty = jestObject.transform;
        let hasBabelTransform = false;
        if (transformProperty) {
            for (const prop in transformProperty) {
                const transformPropValue = transformProperty[prop];
                if (Array.isArray(transformPropValue)) {
                    hasBabelTransform = transformPropValue.some((value) => typeof value === 'string' && value.includes('babel'));
                }
                else if (typeof transformPropValue === 'string') {
                    transformPropValue.includes('babel');
                }
            }
        }
        if (hasBabelTransform) {
            return;
        }
        // Add ts-jest configurations
        const existingGlobals = jestObject.globals;
        if (!existingGlobals) {
            update_config_1.addPropertyToJestConfig(host, jestConfig, 'globals', {
                'ts-jest': globalTsJest,
            });
        }
        else {
            const existingGlobalTsJest = existingGlobals['ts-jest'];
            if (!checkJestPropertyObject(existingGlobalTsJest)) {
                update_config_1.addPropertyToJestConfig(host, jestConfig, 'globals.ts-jest', globalTsJest);
            }
        }
    }
    catch (_a) {
        context.logger.warn(`
    Cannot update jest config for the ${project} project. 
    This is most likely caused because the jest config at ${jestConfig} it not in a expected configuration format (ie. module.exports = {}).
    
    Since this migration could not be ran on this project, please make sure to modify the Jest config file to have the following configured:
    * setupFilesAfterEnv with: "${setupFile}"
    * globals.ts-jest with: 
    "${workspace_1.serializeJson(globalTsJest)}"
  `);
    }
}
function updateJestConfigForProjects() {
    return (host, context) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const workspace = yield workspace_1.getWorkspace(host, workspace_1.getWorkspacePath(host));
        for (const [projectName, projectDefinition] of workspace.projects) {
            for (const [, testTarget] of projectDefinition.targets) {
                if (testTarget.builder !== '@nrwl/jest:jest') {
                    continue;
                }
                const setupfile = (_a = testTarget.options) === null || _a === void 0 ? void 0 : _a.setupFile;
                const jestConfig = (_c = (_b = testTarget.options) === null || _b === void 0 ? void 0 : _b.jestConfig) !== null && _c !== void 0 ? _c : '';
                const tsConfig = (_e = (_d = testTarget.options) === null || _d === void 0 ? void 0 : _d.tsConfig) !== null && _e !== void 0 ? _e : '';
                const tsConfigWithRootDir = tsConfig.replace(projectDefinition.root, '<rootDir>');
                let isAngular = false;
                let setupFileWithRootDir = '';
                if (typeof setupfile === 'string') {
                    isAngular = (_f = host
                        .read(setupfile)) === null || _f === void 0 ? void 0 : _f.toString().includes('jest-preset-angular');
                    setupFileWithRootDir = setupfile.replace(projectDefinition.root, '<rootDir>');
                }
                modifyJestConfig(host, context, projectName, setupFileWithRootDir, jestConfig, tsConfigWithRootDir, isAngular);
                const updatedOptions = Object.assign({}, testTarget.options);
                delete updatedOptions.setupFile;
                delete updatedOptions.tsConfig;
                testTarget.options = updatedOptions;
            }
        }
        return workspace_1.updateWorkspace(workspace);
    });
}
function update() {
    return schematics_1.chain([updateJestConfigForProjects(), workspace_1.formatFiles()]);
}
exports.default = update;
//# sourceMappingURL=update-jest-configs.js.map