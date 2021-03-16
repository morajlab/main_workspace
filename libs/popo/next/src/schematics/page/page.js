"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const styles_1 = require("../../utils/styles");
/*
 * This schematic is basically the React component one, but for Next we need
 * extra dependencies for css, sass, less, styl style options, and make sure
 * it is under `pages` folder.
 */
function default_1(options) {
    return schematics_1.chain([
        schematics_1.externalSchematic('@nrwl/react', 'component', Object.assign(Object.assign({}, options), { directory: options.directory ? `pages/${options.directory}` : 'pages', pascalCaseFiles: false, export: false, classComponent: false, routing: false, skipTests: !options.withTests, flat: true })),
        styles_1.addStyleDependencies(options.style),
    ]);
}
exports.default = default_1;
//# sourceMappingURL=page.js.map