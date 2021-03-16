"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStyledModuleDependencies = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const styled_1 = require("../utils/styled");
function addStyledModuleDependencies(styledModule) {
    const extraDependencies = styled_1.CSS_IN_JS_DEPENDENCIES[styledModule];
    return extraDependencies
        ? workspace_1.addDepsToPackageJson(extraDependencies.dependencies, extraDependencies.devDependencies)
        : schematics_1.noop();
}
exports.addStyledModuleDependencies = addStyledModuleDependencies;
//# sourceMappingURL=add-styled-dependencies.js.map