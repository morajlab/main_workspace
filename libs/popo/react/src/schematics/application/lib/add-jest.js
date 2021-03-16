"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addJest = void 0;
const schematics_1 = require("@angular-devkit/schematics");
function addJest(options) {
    return options.unitTestRunner === 'jest'
        ? schematics_1.externalSchematic('@nrwl/jest', 'jest-project', {
            project: options.projectName,
            supportTsx: true,
            skipSerializers: true,
            setupFile: 'none',
            babelJest: true,
        })
        : schematics_1.noop();
}
exports.addJest = addJest;
//# sourceMappingURL=add-jest.js.map