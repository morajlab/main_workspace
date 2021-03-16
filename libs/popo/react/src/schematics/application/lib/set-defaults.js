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
            workspace.extensions.schematics['@nrwl/react'] =
                workspace.extensions.schematics['@nrwl/react'] || {};
            const prev = jsonIdentity(workspace.extensions.schematics['@nrwl/react']);
            workspace.extensions.schematics = Object.assign(Object.assign({}, workspace.extensions.schematics), { '@nrwl/react': Object.assign(Object.assign({}, prev), { application: Object.assign({ style: options.style, linter: options.linter }, jsonIdentity(prev.application)), component: Object.assign({ style: options.style }, jsonIdentity(prev.component)), library: Object.assign({ style: options.style, linter: options.linter }, jsonIdentity(prev.library)) }) });
        });
}
exports.setDefaults = setDefaults;
function jsonIdentity(x) {
    return x;
}
//# sourceMappingURL=set-defaults.js.map