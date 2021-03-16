"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSS_IN_JS_DEPENDENCIES = void 0;
const versions_1 = require("./versions");
exports.CSS_IN_JS_DEPENDENCIES = {
    'styled-components': {
        dependencies: {
            'react-is': versions_1.reactIsVersion,
            'styled-components': versions_1.styledComponentsVersion,
        },
        devDependencies: {
            '@types/styled-components': versions_1.typesStyledComponentsVersion,
            '@types/react-is': versions_1.typesReactIsVersion,
            'babel-plugin-styled-components': versions_1.babelPluginStyledComponentsVersion,
        },
    },
    '@emotion/styled': {
        dependencies: {
            '@emotion/styled': versions_1.emotionStyledVersion,
            '@emotion/core': versions_1.emotionCoreVersion,
        },
        devDependencies: {
            '@emotion/babel-preset-css-prop': versions_1.emotionBabelPresetCssPropVersion,
        },
    },
    'styled-jsx': {
        dependencies: {
            'styled-jsx': versions_1.styledJsxVersion,
        },
        devDependencies: {
            '@types/styled-jsx': versions_1.typesStyledJsxVersion,
        },
    },
};
//# sourceMappingURL=styled.js.map