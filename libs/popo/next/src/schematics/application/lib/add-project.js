"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProject = void 0;
const core_1 = require("@angular-devkit/core");
const workspace_1 = require("@nrwl/workspace");
const ast_utils_1 = require("@nrwl/workspace/src/utils/ast-utils");
function addProject(options) {
    return ast_utils_1.updateWorkspaceInTree((json) => {
        const architect = {};
        const { server } = options;
        architect.build = {
            builder: '@nrwl/next:build',
            options: {
                root: options.appProjectRoot,
                outputPath: core_1.join(core_1.normalize('dist'), options.appProjectRoot),
            },
            // This has to be here so `nx serve [app] --prod` will work. Otherwise
            // a missing configuration error will be thrown.
            configurations: {
                production: {},
            },
        };
        architect.serve = {
            builder: '@nrwl/next:server',
            options: {
                buildTarget: `${options.projectName}:build`,
                dev: true,
            },
            configurations: {
                production: {
                    buildTarget: `${options.projectName}:build:production`,
                    dev: false,
                },
            },
        };
        if (server) {
            architect.serve.options = Object.assign(Object.assign({}, architect.serve.options), { customServerPath: options.server });
        }
        architect.export = {
            builder: '@nrwl/next:export',
            options: {
                buildTarget: `${options.projectName}:build:production`,
            },
        };
        architect.lint = workspace_1.generateProjectLint(core_1.normalize(options.appProjectRoot), core_1.join(core_1.normalize(options.appProjectRoot), 'tsconfig.json'), options.linter, [`${options.appProjectRoot}/**/*.{ts,tsx}`]);
        json.projects[options.projectName] = {
            root: options.appProjectRoot,
            sourceRoot: options.appProjectRoot,
            projectType: 'application',
            schematics: {},
            architect,
        };
        json.defaultProject = json.defaultProject || options.projectName;
        return json;
    });
}
exports.addProject = addProject;
//# sourceMappingURL=add-project.js.map