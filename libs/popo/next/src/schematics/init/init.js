"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const versions_1 = require("../../utils/versions");
const versions_2 = require("@nrwl/react/src/utils/versions");
const updateDependencies = workspace_1.addDepsToPackageJson({
    next: versions_1.nextVersion,
    react: versions_2.reactVersion,
    'react-dom': versions_2.reactDomVersion,
    tslib: '^2.0.0',
}, {});
function default_1(schema) {
    return schematics_1.chain([
        workspace_1.setDefaultCollection('@nrwl/next'),
        schema.unitTestRunner === 'jest'
            ? workspace_1.addPackageWithInit('@nrwl/jest')
            : schematics_1.noop(),
        schema.e2eTestRunner === 'cypress'
            ? workspace_1.addPackageWithInit('@nrwl/cypress')
            : schematics_1.noop(),
        workspace_1.addPackageWithInit('@nrwl/web', schema),
        workspace_1.addPackageWithInit('@nrwl/react', schema),
        updateDependencies,
    ]);
}
exports.default = default_1;
//# sourceMappingURL=init.js.map