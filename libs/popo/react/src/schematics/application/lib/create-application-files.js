"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationFiles = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const to_js_1 = require("@nrwl/workspace/src/utils/rules/to-js");
const create_application_files_helpers_1 = require("./create-application-files.helpers");
function createApplicationFiles(options) {
    return schematics_1.mergeWith(schematics_1.apply(schematics_1.url(`./files/app`), [
        schematics_1.template(Object.assign(Object.assign(Object.assign({}, workspace_1.names(options.name)), options), { tmpl: '', offsetFromRoot: workspace_1.offsetFromRoot(options.appProjectRoot), appContent: create_application_files_helpers_1.createAppJsx(options.name), styleContent: create_application_files_helpers_1.createStyleRules({
                isUsingJsxBasedSolution: !!options.styledModule,
                createHostBlock: !options.styledModule || options.styledModule === 'styled-jsx',
            }) })),
        options.styledModule || !options.hasStyles
            ? schematics_1.filter((file) => !file.endsWith(`.${options.style}`))
            : schematics_1.noop(),
        options.unitTestRunner === 'none'
            ? schematics_1.filter((file) => file !== `/src/app/${options.fileName}.spec.tsx`)
            : schematics_1.noop(),
        schematics_1.move(options.appProjectRoot),
        options.js ? to_js_1.toJS() : schematics_1.noop(),
    ]));
}
exports.createApplicationFiles = createApplicationFiles;
//# sourceMappingURL=create-application-files.js.map