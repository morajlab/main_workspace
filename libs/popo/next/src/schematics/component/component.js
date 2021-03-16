"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const styles_1 = require("../../utils/styles");
/*
 * This schematic is basically the React one, but for Next we need
 * extra dependencies for css, sass, less, styl style options.
 */
function default_1(options) {
    return schematics_1.chain([
        schematics_1.externalSchematic('@nrwl/react', 'component', Object.assign(Object.assign({}, options), { directory: options.directory || 'components', pascalCaseFiles: false, export: false, classComponent: false, routing: false })),
        styles_1.addStyleDependencies(options.style),
    ]);
}
exports.default = default_1;
//# sourceMappingURL=component.js.map