"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const versions_1 = require("../../utils/versions");
function setDefault() {
    const updateReactWorkspace = workspace_1.updateWorkspace((workspace) => {
        // Also generate all new react apps with babel.
        workspace.extensions.schematics =
            jsonIdentity(workspace.extensions.schematics) || {};
        const reactSchematics = jsonIdentity(workspace.extensions.schematics['@nrwl/react']) || {};
        workspace.extensions.schematics = Object.assign(Object.assign({}, workspace.extensions.schematics), { '@nrwl/react': Object.assign(Object.assign({}, reactSchematics), { application: Object.assign(Object.assign({}, jsonIdentity(reactSchematics.application)), { babel: true }) }) });
    });
    return schematics_1.chain([workspace_1.setDefaultCollection('@nrwl/react'), updateReactWorkspace]);
}
function jsonIdentity(x) {
    return x;
}
function default_1(schema) {
    return schematics_1.chain([
        setDefault(),
        schema.unitTestRunner === 'jest'
            ? workspace_1.addPackageWithInit('@nrwl/jest')
            : schematics_1.noop(),
        schema.e2eTestRunner === 'cypress'
            ? workspace_1.addPackageWithInit('@nrwl/cypress')
            : schematics_1.noop(),
        workspace_1.addPackageWithInit('@nrwl/web', schema),
        workspace_1.addDepsToPackageJson({
            react: versions_1.reactVersion,
            'react-dom': versions_1.reactDomVersion,
            tslib: '^2.0.0',
        }, {
            '@nrwl/react': versions_1.nxVersion,
            '@types/react': versions_1.typesReactVersion,
            '@types/react-dom': versions_1.typesReactDomVersion,
            '@testing-library/react': versions_1.testingLibraryReactVersion,
        }),
    ]);
}
exports.default = default_1;
//# sourceMappingURL=init.js.map