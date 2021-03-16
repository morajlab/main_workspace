"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCorePlugins = exports.fetchCorePlugins = void 0;
const core_1 = require("@angular-devkit/core");
const output_1 = require("../output");
function fetchCorePlugins() {
    const corePlugins = [
        {
            name: '@nrwl/angular',
            capabilities: 'schematics',
        },
        {
            name: '@nrwl/cypress',
            capabilities: 'builders,schematics',
        },
        {
            name: '@nrwl/express',
            capabilities: 'builders,schematics',
        },
        {
            name: '@nrwl/jest',
            capabilities: 'builders,schematics',
        },
        {
            name: '@nrwl/linter',
            capabilities: 'builders',
        },
        {
            name: '@nrwl/nest',
            capabilities: 'builders,schematics',
        },
        {
            name: '@nrwl/next',
            capabilities: 'builders,schematics',
        },
        {
            name: '@nrwl/node',
            capabilities: 'builders,schematics',
        },
        {
            name: '@nrwl/nx-plugin',
            capabilities: 'builders,schematics',
        },
        {
            name: '@nrwl/react',
            capabilities: 'builders,schematics',
        },
        {
            name: '@nrwl/storybook',
            capabilities: 'builders,schematics',
        },
        {
            name: '@nrwl/web',
            capabilities: 'builders,schematics',
        },
        {
            name: '@nrwl/workspace',
            capabilities: 'builders,schematics',
        },
    ];
    return corePlugins;
}
exports.fetchCorePlugins = fetchCorePlugins;
function listCorePlugins(installedPlugins, corePlugins) {
    const installedPluginsMap = new Set(installedPlugins.map((p) => p.name));
    const alsoAvailable = corePlugins.filter((p) => !installedPluginsMap.has(p.name));
    if (alsoAvailable.length) {
        output_1.output.log({
            title: `Also available:`,
            bodyLines: alsoAvailable.map((p) => {
                return `${core_1.terminal.bold(p.name)} (${p.capabilities})`;
            }),
        });
    }
}
exports.listCorePlugins = listCorePlugins;
//# sourceMappingURL=core-plugins.js.map