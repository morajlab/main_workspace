"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactEslintJson = exports.extraEslintDependencies = void 0;
const versions_1 = require("./versions");
exports.extraEslintDependencies = {
    dependencies: {},
    devDependencies: {
        'eslint-plugin-import': versions_1.eslintPluginImportVersion,
        'eslint-plugin-jsx-a11y': versions_1.eslintPluginJsxA11yVersion,
        'eslint-plugin-react': versions_1.eslintPluginReactVersion,
        'eslint-plugin-react-hooks': versions_1.eslintPluginReactHooksVersion,
    },
};
exports.reactEslintJson = {
    extends: ['plugin:@nrwl/nx/react'],
};
//# sourceMappingURL=lint.js.map