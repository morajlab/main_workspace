"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
function generateStories(schema) {
    return (tree, context) => {
        return schematics_1.schematic('stories', {
            project: schema.name,
            generateCypressSpecs: schema.configureCypress && schema.generateCypressSpecs,
            js: schema.js,
        });
    };
}
function default_1(schema) {
    return schematics_1.chain([
        schematics_1.externalSchematic('@nrwl/storybook', 'configuration', {
            name: schema.name,
            uiFramework: '@storybook/react',
            configureCypress: schema.configureCypress,
            generateCypressSpecs: schema.generateCypressSpecs,
            js: schema.js,
            linter: schema.linter,
        }),
        schema.generateStories ? generateStories(schema) : schematics_1.noop(),
    ]);
}
exports.default = default_1;
//# sourceMappingURL=configuration.js.map