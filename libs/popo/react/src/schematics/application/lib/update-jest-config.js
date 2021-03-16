"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJestConfig = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const update_babel_jest_config_1 = require("../../../rules/update-babel-jest-config");
const jest_utils_1 = require("../../../utils/jest-utils");
const workspace_1 = require("@nrwl/workspace");
function updateJestConfig(options) {
    return options.unitTestRunner === 'none'
        ? schematics_1.noop()
        : schematics_1.chain([
            workspace_1.updateJsonInTree(`${options.appProjectRoot}/tsconfig.spec.json`, (json) => {
                const offset = workspace_1.offsetFromRoot(options.appProjectRoot);
                json.files = [
                    `${offset}node_modules/@nrwl/react/typings/cssmodule.d.ts`,
                    `${offset}node_modules/@nrwl/react/typings/image.d.ts`,
                ];
                if (options.style === 'styled-jsx') {
                    json.files.unshift(`${offset}node_modules/@nrwl/react/typings/styled-jsx.d.ts`);
                }
                return json;
            }),
            (host) => {
                const configPath = `${options.appProjectRoot}/jest.config.js`;
                const originalContent = host.read(configPath).toString();
                const content = jest_utils_1.updateJestConfigContent(originalContent);
                host.overwrite(configPath, content);
            },
            update_babel_jest_config_1.updateBabelJestConfig(options.appProjectRoot, (json) => {
                if (options.style === 'styled-jsx') {
                    json.plugins = (json.plugins || []).concat('styled-jsx/babel');
                }
                return json;
            }),
        ]);
}
exports.updateJestConfig = updateJestConfig;
//# sourceMappingURL=update-jest-config.js.map