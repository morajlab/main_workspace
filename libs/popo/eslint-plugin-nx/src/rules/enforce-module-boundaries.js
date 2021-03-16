"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_NAME = void 0;
const app_root_1 = require("@nrwl/workspace/src/utils/app-root");
const runtime_lint_utils_1 = require("@nrwl/workspace/src/utils/runtime-lint-utils");
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const core_1 = require("@angular-devkit/core");
const project_graph_1 = require("@nrwl/workspace/src/core/project-graph");
const file_utils_1 = require("@nrwl/workspace/src/core/file-utils");
const target_project_locator_1 = require("@nrwl/workspace/src/core/target-project-locator");
exports.RULE_NAME = 'enforce-module-boundaries';
exports.default = create_eslint_rule_1.createESLintRule({
    name: exports.RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Ensure that module boundaries are respected within the monorepo`,
            category: 'Best Practices',
            recommended: 'error',
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    enforceBuildableLibDependency: { type: 'boolean' },
                    allow: [{ type: 'string' }],
                    depConstraints: [
                        {
                            type: 'object',
                            properties: {
                                sourceTag: { type: 'string' },
                                onlyDependOnLibsWithTags: [{ type: 'string' }],
                            },
                            additionalProperties: false,
                        },
                    ],
                },
                additionalProperties: false,
            },
        ],
        messages: {
            noRelativeOrAbsoluteImportsAcrossLibraries: `Libraries cannot be imported by a relative or absolute path, and must begin with a npm scope`,
            noCircularDependencies: `Circular dependency between "{{sourceProjectName}}" and "{{targetProjectName}}" detected: {{path}}`,
            noImportsOfApps: 'Imports of apps are forbidden',
            noImportsOfE2e: 'Imports of e2e projects are forbidden',
            noImportOfNonBuildableLibraries: 'Buildable libraries cannot import non-buildable libraries',
            noImportsOfLazyLoadedLibraries: `Imports of lazy-loaded libraries are forbidden`,
            projectWithoutTagsCannotHaveDependencies: `A project without tags cannot depend on any libraries`,
            tagConstraintViolation: `A project tagged with "{{sourceTag}}" can only depend on libs tagged with {{allowedTags}}`,
        },
    },
    defaultOptions: [
        {
            allow: [],
            depConstraints: [],
            enforceBuildableLibDependency: false,
        },
    ],
    create(context, [{ allow, depConstraints, enforceBuildableLibDependency }]) {
        /**
         * Globally cached info about workspace
         */
        const projectPath = core_1.normalize(global.projectPath || app_root_1.appRootPath);
        if (!global.projectGraph) {
            const workspaceJson = file_utils_1.readWorkspaceJson();
            const nxJson = file_utils_1.readNxJson();
            global.npmScope = nxJson.npmScope;
            global.projectGraph = project_graph_1.createProjectGraph(workspaceJson, nxJson);
        }
        const npmScope = global.npmScope;
        const projectGraph = global.projectGraph;
        if (!global.targetProjectLocator) {
            global.targetProjectLocator = new target_project_locator_1.TargetProjectLocator(projectGraph.nodes);
        }
        const targetProjectLocator = global
            .targetProjectLocator;
        return {
            ImportDeclaration(node) {
                const imp = node.source.value;
                const sourceFilePath = runtime_lint_utils_1.getSourceFilePath(core_1.normalize(context.getFilename()), projectPath);
                // whitelisted import
                if (allow.some((a) => runtime_lint_utils_1.matchImportWithWildcard(a, imp))) {
                    return;
                }
                // check for relative and absolute imports
                if (runtime_lint_utils_1.isRelativeImportIntoAnotherProject(imp, projectPath, projectGraph, sourceFilePath) ||
                    runtime_lint_utils_1.isAbsoluteImportIntoAnotherProject(imp)) {
                    context.report({
                        node,
                        messageId: 'noRelativeOrAbsoluteImportsAcrossLibraries',
                        data: {
                            npmScope,
                        },
                    });
                    return;
                }
                const sourceProject = runtime_lint_utils_1.findSourceProject(projectGraph, sourceFilePath);
                const targetProject = runtime_lint_utils_1.findProjectUsingImport(projectGraph, targetProjectLocator, sourceFilePath, imp, npmScope);
                // If source or target are not part of an nx workspace, return.
                if (!sourceProject || !targetProject) {
                    return;
                }
                // same project => allow
                if (sourceProject === targetProject) {
                    return;
                }
                // project => npm package
                if (project_graph_1.isNpmProject(targetProject)) {
                    return;
                }
                // check constraints between libs and apps
                // check for circular dependency
                const circularPath = runtime_lint_utils_1.checkCircularPath(projectGraph, sourceProject, targetProject);
                if (circularPath.length !== 0) {
                    context.report({
                        node,
                        messageId: 'noCircularDependencies',
                        data: {
                            sourceProjectName: sourceProject.name,
                            targetProjectName: targetProject.name,
                            path: circularPath.reduce((acc, v) => `${acc} -> ${v.name}`, sourceProject.name),
                        },
                    });
                    return;
                }
                // cannot import apps
                if (targetProject.type === project_graph_1.ProjectType.app) {
                    context.report({
                        node,
                        messageId: 'noImportsOfApps',
                    });
                    return;
                }
                // cannot import e2e projects
                if (targetProject.type === project_graph_1.ProjectType.e2e) {
                    context.report({
                        node,
                        messageId: 'noImportsOfE2e',
                    });
                    return;
                }
                // buildable-lib is not allowed to import non-buildable-lib
                if (enforceBuildableLibDependency === true &&
                    sourceProject.type === project_graph_1.ProjectType.lib &&
                    targetProject.type === project_graph_1.ProjectType.lib) {
                    if (runtime_lint_utils_1.hasArchitectBuildBuilder(sourceProject) &&
                        !runtime_lint_utils_1.hasArchitectBuildBuilder(targetProject)) {
                        context.report({
                            node,
                            messageId: 'noImportOfNonBuildableLibraries',
                        });
                        return;
                    }
                }
                // if we import a library using loadChildren, we should not import it using es6imports
                if (runtime_lint_utils_1.onlyLoadChildren(projectGraph, sourceProject.name, targetProject.name, [])) {
                    context.report({
                        node,
                        messageId: 'noImportsOfLazyLoadedLibraries',
                    });
                    return;
                }
                // check that dependency constraints are satisfied
                if (depConstraints.length > 0) {
                    const constraints = runtime_lint_utils_1.findConstraintsFor(depConstraints, sourceProject);
                    // when no constrains found => error. Force the user to provision them.
                    if (constraints.length === 0) {
                        context.report({
                            node,
                            messageId: 'projectWithoutTagsCannotHaveDependencies',
                        });
                        return;
                    }
                    for (let constraint of constraints) {
                        if (runtime_lint_utils_1.hasNoneOfTheseTags(targetProject, constraint.onlyDependOnLibsWithTags || [])) {
                            const allowedTags = constraint.onlyDependOnLibsWithTags
                                .map((s) => `"${s}"`)
                                .join(', ');
                            context.report({
                                node,
                                messageId: 'tagConstraintViolation',
                                data: {
                                    sourceTag: constraint.sourceTag,
                                    allowedTags,
                                },
                            });
                            return;
                        }
                    }
                }
            },
        };
    },
});
//# sourceMappingURL=enforce-module-boundaries.js.map