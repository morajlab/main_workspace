"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const path_1 = require("path");
const __1 = require("../../..");
const require_jest_config_1 = require("../update-10-0-0/require-jest-config");
const literals_1 = require("@angular-devkit/core/src/utils/literals");
const app_root_1 = require("@nrwl/workspace/src/utils/app-root");
function updateAstTransformers() {
    return (host, context) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const workspace = yield workspace_1.getWorkspace(host);
        for (const [projectName, project] of workspace.projects) {
            for (const [, target] of project.targets) {
                if (target.builder !== '@nrwl/jest:jest') {
                    continue;
                }
                const config = require_jest_config_1.getJestObject(path_1.join(app_root_1.appRootPath, target.options.jestConfig));
                if (!((_b = (_a = config.globals) === null || _a === void 0 ? void 0 : _a['ts-jest']) === null || _b === void 0 ? void 0 : _b.astTransformers) ||
                    !Array.isArray((_d = (_c = config.globals) === null || _c === void 0 ? void 0 : _c['ts-jest']) === null || _d === void 0 ? void 0 : _d.astTransformers)) {
                    continue;
                }
                try {
                    __1.removePropertyFromJestConfig(host, target.options.jestConfig, 'globals.ts-jest.astTransformers');
                    __1.addPropertyToJestConfig(host, target.options.jestConfig, 'globals.ts-jest.astTransformers', {
                        before: config.globals['ts-jest'].astTransformers,
                    });
                }
                catch (_e) {
                    context.logger.error(literals_1.stripIndents `Unable to update the AST transformers for project ${projectName}.
            Please define your custom AST transformers in a form of an object.
            More information you can check online documentation https://kulshekhar.github.io/ts-jest/user/config/astTransformers`);
                }
            }
        }
    });
}
function update() {
    return schematics_1.chain([
        workspace_1.updatePackagesInPackageJson(path_1.join(__dirname, '../../../migrations.json'), '10.3.0'),
        updateAstTransformers(),
        workspace_1.formatFiles(),
    ]);
}
exports.default = update;
//# sourceMappingURL=update-ts-jest.js.map