"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addJest = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
function addJest(options) {
    return options.unitTestRunner === 'jest'
        ? schematics_1.chain([
            schematics_1.externalSchematic('@nrwl/jest', 'jest-project', {
                project: options.projectName,
                supportTsx: true,
                skipSerializers: true,
                setupFile: 'none',
                babelJest: true,
            }),
            workspace_1.updateJsonInTree(`${options.appProjectRoot}/tsconfig.spec.json`, (json) => {
                json.compilerOptions.jsx = 'react';
                return json;
            }),
        ])
        : schematics_1.noop();
}
exports.addJest = addJest;
//# sourceMappingURL=add-jest.js.map