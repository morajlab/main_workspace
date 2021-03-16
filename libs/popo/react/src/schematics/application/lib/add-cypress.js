"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCypress = void 0;
const schematics_1 = require("@angular-devkit/schematics");
function addCypress(options) {
    return options.e2eTestRunner === 'cypress'
        ? schematics_1.externalSchematic('@nrwl/cypress', 'cypress-project', Object.assign(Object.assign({}, options), { name: options.name + '-e2e', directory: options.directory, project: options.projectName }))
        : schematics_1.noop();
}
exports.addCypress = addCypress;
//# sourceMappingURL=add-cypress.js.map