"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rule = void 0;
const Lint = require("tslint");
const project_graph_1 = require("../core/project-graph");
const app_root_1 = require("../utils/app-root");
const runtime_lint_utils_1 = require("../utils/runtime-lint-utils");
const core_1 = require("@angular-devkit/core");
const file_utils_1 = require("@nrwl/workspace/src/core/file-utils");
const target_project_locator_1 = require("../core/target-project-locator");
class Rule extends Lint.Rules.AbstractRule {
    constructor(options, projectPath, npmScope, projectGraph, targetProjectLocator) {
        super(options);
        this.projectPath = projectPath;
        this.npmScope = npmScope;
        this.projectGraph = projectGraph;
        this.targetProjectLocator = targetProjectLocator;
        if (!projectPath) {
            this.projectPath = core_1.normalize(app_root_1.appRootPath);
            if (!global.projectGraph) {
                const workspaceJson = file_utils_1.readWorkspaceJson();
                const nxJson = file_utils_1.readNxJson();
                global.npmScope = nxJson.npmScope;
                global.projectGraph = project_graph_1.createProjectGraph(workspaceJson, nxJson);
            }
            this.npmScope = global.npmScope;
            this.projectGraph = global.projectGraph;
            if (!global.targetProjectLocator) {
                global.targetProjectLocator = new target_project_locator_1.TargetProjectLocator(this.projectGraph.nodes);
            }
            this.targetProjectLocator = global.targetProjectLocator;
        }
    }
    apply(sourceFile) {
        return this.applyWithWalker(new EnforceModuleBoundariesWalker(sourceFile, this.getOptions(), this.projectPath, this.npmScope, this.projectGraph, this.targetProjectLocator));
    }
}
exports.Rule = Rule;
class EnforceModuleBoundariesWalker extends Lint.RuleWalker {
    constructor(sourceFile, options, projectPath, npmScope, projectGraph, targetProjectLocator) {
        super(sourceFile, options);
        this.projectPath = projectPath;
        this.npmScope = npmScope;
        this.projectGraph = projectGraph;
        this.targetProjectLocator = targetProjectLocator;
        this.enforceBuildableLibDependency = false; // for backwards compat
        this.allow = Array.isArray(this.getOptions()[0].allow)
            ? this.getOptions()[0].allow.map((a) => `${a}`)
            : [];
        this.depConstraints = Array.isArray(this.getOptions()[0].depConstraints)
            ? this.getOptions()[0].depConstraints
            : [];
        this.enforceBuildableLibDependency =
            this.getOptions()[0].enforceBuildableLibDependency === true;
    }
    visitImportDeclaration(node) {
        const imp = node.moduleSpecifier
            .getText()
            .substring(1, node.moduleSpecifier.getText().length - 1);
        // whitelisted import
        if (this.allow.some((a) => runtime_lint_utils_1.matchImportWithWildcard(a, imp))) {
            super.visitImportDeclaration(node);
            return;
        }
        // check for relative and absolute imports
        if (runtime_lint_utils_1.isRelativeImportIntoAnotherProject(imp, this.projectPath, this.projectGraph, runtime_lint_utils_1.getSourceFilePath(core_1.normalize(this.getSourceFile().fileName), this.projectPath)) ||
            runtime_lint_utils_1.isAbsoluteImportIntoAnotherProject(imp)) {
            this.addFailureAt(node.getStart(), node.getWidth(), `libraries cannot be imported by a relative or absolute path, and must begin with a npm scope`);
            return;
        }
        const filePath = runtime_lint_utils_1.getSourceFilePath(this.getSourceFile().fileName, this.projectPath);
        const sourceProject = runtime_lint_utils_1.findSourceProject(this.projectGraph, filePath);
        const targetProject = runtime_lint_utils_1.findProjectUsingImport(this.projectGraph, this.targetProjectLocator, filePath, imp, this.npmScope);
        // If source or target are not part of an nx workspace, return.
        if (!sourceProject || !targetProject) {
            super.visitImportDeclaration(node);
            return;
        }
        // same project => allow
        if (sourceProject === targetProject) {
            super.visitImportDeclaration(node);
            return;
        }
        // project => npm package
        if (project_graph_1.isNpmProject(targetProject)) {
            super.visitImportDeclaration(node);
            return;
        }
        // check for circular dependency
        const circularPath = runtime_lint_utils_1.checkCircularPath(this.projectGraph, sourceProject, targetProject);
        if (circularPath.length !== 0) {
            const path = circularPath.reduce((acc, v) => `${acc} -> ${v.name}`, sourceProject.name);
            const error = `Circular dependency between "${sourceProject.name}" and "${targetProject.name}" detected: ${path}`;
            this.addFailureAt(node.getStart(), node.getWidth(), error);
            return;
        }
        // cannot import apps
        if (targetProject.type === project_graph_1.ProjectType.app) {
            this.addFailureAt(node.getStart(), node.getWidth(), 'imports of apps are forbidden');
            return;
        }
        // cannot import e2e projects
        if (targetProject.type === project_graph_1.ProjectType.e2e) {
            this.addFailureAt(node.getStart(), node.getWidth(), 'imports of e2e projects are forbidden');
            return;
        }
        // buildable-lib is not allowed to import non-buildable-lib
        if (this.enforceBuildableLibDependency === true &&
            sourceProject.type === project_graph_1.ProjectType.lib &&
            targetProject.type === project_graph_1.ProjectType.lib) {
            if (runtime_lint_utils_1.hasArchitectBuildBuilder(sourceProject) &&
                !runtime_lint_utils_1.hasArchitectBuildBuilder(targetProject)) {
                this.addFailureAt(node.getStart(), node.getWidth(), 'buildable libraries cannot import non-buildable libraries');
                return;
            }
        }
        // if we import a library using loadChildren, we should not import it using es6imports
        if (runtime_lint_utils_1.onlyLoadChildren(this.projectGraph, sourceProject.name, targetProject.name, [])) {
            this.addFailureAt(node.getStart(), node.getWidth(), 'imports of lazy-loaded libraries are forbidden');
            return;
        }
        // check that dependency constraints are satisfied
        if (this.depConstraints.length > 0) {
            const constraints = runtime_lint_utils_1.findConstraintsFor(this.depConstraints, sourceProject);
            // when no constrains found => error. Force the user to provision them.
            if (constraints.length === 0) {
                this.addFailureAt(node.getStart(), node.getWidth(), `A project without tags cannot depend on any libraries`);
                return;
            }
            for (let constraint of constraints) {
                if (runtime_lint_utils_1.hasNoneOfTheseTags(targetProject, constraint.onlyDependOnLibsWithTags || [])) {
                    const allowedTags = constraint.onlyDependOnLibsWithTags
                        .map((s) => `"${s}"`)
                        .join(', ');
                    const error = `A project tagged with "${constraint.sourceTag}" can only depend on libs tagged with ${allowedTags}`;
                    this.addFailureAt(node.getStart(), node.getWidth(), error);
                    return;
                }
            }
        }
        super.visitImportDeclaration(node);
    }
}
//# sourceMappingURL=nxEnforceModuleBoundariesRule.js.map