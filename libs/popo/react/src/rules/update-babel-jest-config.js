"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBabelJestConfig = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
function updateBabelJestConfig(projectRoot, update) {
    return (host) => {
        const configPath = `${projectRoot}/babel-jest.config.json`;
        return host.exists(configPath)
            ? workspace_1.updateJsonInTree(configPath, update)
            : schematics_1.noop();
    };
}
exports.updateBabelJestConfig = updateBabelJestConfig;
//# sourceMappingURL=update-babel-jest-config.js.map