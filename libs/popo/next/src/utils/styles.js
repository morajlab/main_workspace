"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStyleDependencies = exports.NEXT_SPECIFIC_STYLE_DEPENDENCIES = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const react_1 = require("@nrwl/react");
const versions_1 = require("./versions");
exports.NEXT_SPECIFIC_STYLE_DEPENDENCIES = {
    'styled-components': {
        dependencies: react_1.CSS_IN_JS_DEPENDENCIES['styled-components'].dependencies,
        devDependencies: Object.assign(Object.assign({}, react_1.CSS_IN_JS_DEPENDENCIES['styled-components'].devDependencies), { 'babel-plugin-styled-components': versions_1.babelPluginStyledComponentsVersion }),
    },
    '@emotion/styled': {
        dependencies: Object.assign(Object.assign({}, react_1.CSS_IN_JS_DEPENDENCIES['@emotion/styled'].dependencies), { 'emotion-server': versions_1.emotionServerVersion }),
        devDependencies: react_1.CSS_IN_JS_DEPENDENCIES['@emotion/styled'].devDependencies,
    },
    css: {
        dependencies: {},
        devDependencies: {},
    },
    scss: {
        dependencies: {},
        devDependencies: {
            'node-sass': versions_1.nodeSass,
        },
    },
    less: {
        dependencies: {
            '@zeit/next-less': versions_1.zeitNextLess,
        },
        devDependencies: {},
    },
    styl: {
        dependencies: {
            '@zeit/next-stylus': versions_1.zeitNextStylus,
        },
        devDependencies: {},
    },
};
function addStyleDependencies(style) {
    const extraDependencies = exports.NEXT_SPECIFIC_STYLE_DEPENDENCIES[style];
    return extraDependencies
        ? workspace_1.addDepsToPackageJson(extraDependencies.dependencies, extraDependencies.devDependencies)
        : schematics_1.noop();
}
exports.addStyleDependencies = addStyleDependencies;
//# sourceMappingURL=styles.js.map