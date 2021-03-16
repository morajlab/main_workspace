"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOptions = void 0;
const core_1 = require("@angular-devkit/core");
const react_1 = require("@nrwl/react");
const workspace_1 = require("@nrwl/workspace");
const ast_utils_1 = require("@nrwl/workspace/src/utils/ast-utils");
function normalizeOptions(host, options) {
    const appDirectory = options.directory
        ? `${workspace_1.toFileName(options.directory)}/${workspace_1.toFileName(options.name)}`
        : workspace_1.toFileName(options.name);
    const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');
    const e2eProjectName = `${appProjectName}-e2e`;
    const appProjectRoot = core_1.normalize(`${ast_utils_1.appsDir(host)}/${appDirectory}`);
    const e2eProjectRoot = core_1.normalize(`${ast_utils_1.appsDir(host)}/${appDirectory}-e2e`);
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : [];
    const fileName = 'index';
    const styledModule = /^(css|scss|less|styl)$/.test(options.style)
        ? null
        : options.style;
    react_1.assertValidStyle(options.style);
    return Object.assign(Object.assign({}, options), { name: workspace_1.toFileName(options.name), projectName: appProjectName, appProjectRoot,
        e2eProjectRoot,
        e2eProjectName,
        parsedTags,
        fileName,
        styledModule });
}
exports.normalizeOptions = normalizeOptions;
//# sourceMappingURL=normalize-options.js.map