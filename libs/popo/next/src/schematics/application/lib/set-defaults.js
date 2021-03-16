"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaults = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
function setDefaults(options) {
    return options.skipWorkspaceJson
        ? schematics_1.noop()
        : workspace_1.updateWorkspace((workspace) => {
            workspace.extensions.schematics = jsonIdentity(workspace.extensions.schematics || {});
            workspace.extensions.schematics['@nrwl/next'] =
                workspace.extensions.schematics['@nrwl/next'] || {};
            const prev = jsonIdentity(workspace.extensions.schematics['@nrwl/next']);
            workspace.extensions.schematics = Object.assign(Object.assign({}, workspace.extensions.schematics), { '@nrwl/next': Object.assign(Object.assign({}, prev), { application: Object.assign({ style: options.style, linter: options.linter }, jsonIdentity(prev.application)) }) });
        });
}
exports.setDefaults = setDefaults;
function jsonIdentity(x) {
    return x;
}
//# sourceMappingURL=set-defaults.js.map