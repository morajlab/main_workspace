"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
require("@nrwl/tao/src/compat/compat");
const workspace_1 = require("@nrwl/workspace");
const ast_utils_1 = require("@nrwl/workspace/src/utils/ast-utils");
const to_js_1 = require("@nrwl/workspace/src/utils/rules/to-js");
const path = require("path");
const ts = require("typescript");
const ast_utils_2 = require("../../utils/ast-utils");
const versions_1 = require("../../utils/versions");
function default_1(schema) {
    return (host, context) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const options = yield normalizeOptions(host, schema);
        return schematics_1.chain([
            generateReduxFiles(options),
            addExportsToBarrel(options),
            addReduxPackageDependencies,
            addStoreConfiguration(options, context),
            updateReducerConfiguration(options, context),
            workspace_1.formatFiles(),
        ]);
    });
}
exports.default = default_1;
function generateReduxFiles(options) {
    const templateSource = schematics_1.apply(schematics_1.url('./files'), [
        schematics_1.template(Object.assign(Object.assign({}, options), { tmpl: '' })),
        schematics_1.move(options.filesPath),
        options.js ? to_js_1.toJS() : schematics_1.noop(),
    ]);
    return schematics_1.mergeWith(templateSource);
}
function addReduxPackageDependencies() {
    return ast_utils_1.addDepsToPackageJson({
        '@reduxjs/toolkit': versions_1.reduxjsToolkitVersion,
        'react-redux': versions_1.reactReduxVersion,
        '@types/react-redux': versions_1.typesReactReduxVersion,
    }, {});
}
function addExportsToBarrel(options) {
    return (host) => {
        const indexFilePath = path.join(options.projectSourcePath, options.js ? 'index.js' : 'index.ts');
        const buffer = host.read(indexFilePath);
        if (!!buffer) {
            const indexSource = buffer.toString('utf-8');
            const indexSourceFile = ts.createSourceFile(indexFilePath, indexSource, ts.ScriptTarget.Latest, true);
            const statePath = options.directory
                ? `./lib/${options.directory}/${options.fileName}`
                : `./lib/${options.fileName}`;
            ast_utils_1.insert(host, indexFilePath, [
                ...ast_utils_1.addGlobal(indexSourceFile, indexFilePath, `export * from '${statePath}.slice';`),
            ]);
        }
        return host;
    };
}
function addStoreConfiguration(options, context) {
    return options.appProjectSourcePath
        ? (host) => {
            const mainSource = host.read(options.appMainFilePath).toString();
            if (!mainSource.includes('redux')) {
                const mainSourceFile = ts.createSourceFile(options.appMainFilePath, mainSource, ts.ScriptTarget.Latest, true);
                ast_utils_1.insert(host, options.appMainFilePath, ast_utils_2.addReduxStoreToMain(options.appMainFilePath, mainSourceFile, context));
            }
            return host;
        }
        : schematics_1.noop();
}
function updateReducerConfiguration(options, context) {
    return options.appProjectSourcePath
        ? (host) => {
            const mainSource = host.read(options.appMainFilePath).toString();
            const mainSourceFile = ts.createSourceFile(options.appMainFilePath, mainSource, ts.ScriptTarget.Latest, true);
            ast_utils_1.insert(host, options.appMainFilePath, ast_utils_2.updateReduxStore(options.appMainFilePath, mainSourceFile, context, {
                keyName: `${options.constantName}_FEATURE_KEY`,
                reducerName: `${options.propertyName}Reducer`,
                modulePath: `${options.projectModulePath}`,
            }));
            return host;
        }
        : schematics_1.noop();
}
function normalizeOptions(host, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let appProjectSourcePath;
        let appMainFilePath;
        const extraNames = workspace_1.names(options.name);
        const { sourceRoot } = ast_utils_1.getProjectConfig(host, options.project);
        const workspace = yield workspace_1.getWorkspace(host);
        const projectType = workspace.projects.get(options.project).extensions
            .projectType;
        const tsConfigJson = ast_utils_1.readJsonInTree(host, 'tsconfig.base.json');
        const tsPaths = tsConfigJson.compilerOptions
            ? tsConfigJson.compilerOptions.paths || {}
            : {};
        const modulePath = projectType === 'application'
            ? options.directory
                ? `./app/${options.directory}/${extraNames.fileName}.slice`
                : `./app/${extraNames.fileName}.slice`
            : Object.keys(tsPaths).find((k) => tsPaths[k].some((s) => s.includes(sourceRoot)));
        // If --project is set to an app, automatically configure store
        // for it without needing to specify --appProject.
        options.appProject =
            options.appProject ||
                (projectType === 'application' ? options.project : undefined);
        if (options.appProject) {
            const appConfig = ast_utils_1.getProjectConfig(host, options.appProject);
            if (appConfig.projectType !== 'application') {
                throw new Error(`Expected ${options.appProject} to be an application but got ${appConfig.projectType}`);
            }
            appProjectSourcePath = appConfig.sourceRoot;
            appMainFilePath = path.join(appProjectSourcePath, options.js ? 'main.js' : 'main.tsx');
            if (!host.exists(appMainFilePath)) {
                throw new Error(`Could not find ${appMainFilePath} during store configuration`);
            }
        }
        return Object.assign(Object.assign(Object.assign({}, options), extraNames), { constantName: core_1.strings.underscore(options.name).toUpperCase(), directory: workspace_1.toFileName(options.directory), projectType, projectSourcePath: sourceRoot, projectModulePath: modulePath, appProjectSourcePath,
            appMainFilePath, filesPath: core_1.join(sourceRoot, projectType === 'application' ? 'app' : 'lib') });
    });
}
//# sourceMappingURL=redux.js.map