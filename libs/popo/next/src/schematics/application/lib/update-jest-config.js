"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJestConfig = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const update_babel_jest_config_1 = require("@nrwl/react/src/rules/update-babel-jest-config");
function updateJestConfig(options) {
    return options.unitTestRunner === 'none'
        ? schematics_1.noop()
        : schematics_1.chain([
            (host) => {
                const configPath = `${options.appProjectRoot}/jest.config.js`;
                const originalContent = host.read(configPath).toString();
                const content = originalContent.replace('transform: {', "transform: {\n    '^(?!.*\\\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',");
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