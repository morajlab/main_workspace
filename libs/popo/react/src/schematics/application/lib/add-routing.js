"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRouting = void 0;
const ts = require("typescript");
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const workspace_1 = require("@nrwl/workspace");
const ast_utils_1 = require("../../../utils/ast-utils");
const versions_1 = require("@nrwl/react/src/utils/versions");
function addRouting(options, context) {
    return options.routing
        ? schematics_1.chain([
            function addRouterToComponent(host) {
                const appPath = core_1.join(options.appProjectRoot, maybeJs(options, `src/app/${options.fileName}.tsx`));
                const appFileContent = host.read(appPath).toString('utf-8');
                const appSource = ts.createSourceFile(appPath, appFileContent, ts.ScriptTarget.Latest, true);
                workspace_1.insert(host, appPath, ast_utils_1.addInitialRoutes(appPath, appSource, context));
            },
            workspace_1.addDepsToPackageJson({ 'react-router-dom': versions_1.reactRouterDomVersion }, { '@types/react-router-dom': versions_1.typesReactRouterDomVersion }),
        ])
        : schematics_1.noop();
}
exports.addRouting = addRouting;
function maybeJs(options, path) {
    return options.js && (path.endsWith('.ts') || path.endsWith('.tsx'))
        ? path.replace(/\.tsx?$/, '.js')
        : path;
}
//# sourceMappingURL=add-routing.js.map