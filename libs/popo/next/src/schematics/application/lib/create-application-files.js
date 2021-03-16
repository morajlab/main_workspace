"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationFiles = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const create_application_files_helpers_1 = require("./create-application-files.helpers");
function createApplicationFiles(options) {
    return schematics_1.mergeWith(schematics_1.apply(schematics_1.url(`./files`), [
        schematics_1.template(Object.assign(Object.assign(Object.assign({}, workspace_1.names(options.name)), options), { tmpl: '', offsetFromRoot: workspace_1.offsetFromRoot(options.appProjectRoot), appContent: create_application_files_helpers_1.createAppJsx(options.name), styleContent: create_application_files_helpers_1.createStyleRules() })),
        options.styledModule
            ? schematics_1.filter((file) => !file.endsWith(`.${options.style}`))
            : schematics_1.noop(),
        // Custom document is used for styled-components SSR in Next.js
        options.style === 'styled-components'
            ? schematics_1.noop()
            : schematics_1.filter((file) => file.indexOf('_document.tsx') === -1),
        options.unitTestRunner === 'none'
            ? schematics_1.filter((file) => file !== `/specs/index.spec.tsx`)
            : schematics_1.noop(),
        schematics_1.move(options.appProjectRoot),
    ]));
}
exports.createApplicationFiles = createApplicationFiles;
//# sourceMappingURL=create-application-files.js.map