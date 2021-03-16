"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const versions_1 = require("../../utils/versions");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const workspace_1 = require("@nrwl/workspace");
const workspace_2 = require("../workspace/workspace");
const workspace_3 = require("../../utils/workspace");
const path_1 = require("path");
const fs_1 = require("fs");
function updatePackageJson() {
    return workspace_1.updateJsonInTree('package.json', (packageJson) => {
        packageJson.scripts = packageJson.scripts || {};
        packageJson.scripts = Object.assign(Object.assign({}, packageJson.scripts), { nx: 'nx', 'affected:apps': 'nx affected:apps', 'affected:libs': 'nx affected:libs', 'affected:build': 'nx affected:build', 'affected:e2e': 'nx affected:e2e', 'affected:test': 'nx affected:test', 'affected:lint': 'nx affected:lint', 'affected:dep-graph': 'nx affected:dep-graph', affected: 'nx affected', format: 'nx format:write', 'format:write': 'nx format:write', 'format:check': 'nx format:check', update: 'ng update @nrwl/workspace', 'update:check': 'ng update', lint: 'nx workspace-lint && ng lint', 'dep-graph': 'nx dep-graph', 'workspace-schematic': 'nx workspace-schematic', help: 'nx help' });
        packageJson.devDependencies = packageJson.devDependencies || {};
        if (!packageJson.dependencies) {
            packageJson.dependencies = {};
        }
        if (!packageJson.dependencies['@nrwl/angular']) {
            packageJson.dependencies['@nrwl/angular'] = versions_1.nxVersion;
        }
        if (!packageJson.devDependencies['@nrwl/workspace']) {
            packageJson.devDependencies['@nrwl/workspace'] = versions_1.nxVersion;
        }
        if (!packageJson.devDependencies['@angular/cli']) {
            packageJson.devDependencies['@angular/cli'] = versions_1.angularCliVersion;
        }
        if (!packageJson.devDependencies['prettier']) {
            packageJson.devDependencies['prettier'] = versions_1.prettierVersion;
        }
        return packageJson;
    });
}
function getRootTsConfigPath(host) {
    return host.exists('tsconfig.base.json')
        ? 'tsconfig.base.json'
        : 'tsconfig.json';
}
function convertPath(name, originalPath) {
    return `apps/${name}/${originalPath}`;
}
function updateAngularCLIJson(options) {
    return workspace_3.updateWorkspace((workspace) => {
        const appName = workspace.extensions.defaultProject;
        const e2eName = appName + '-e2e';
        const e2eRoot = core_1.join(core_1.normalize('apps'), e2eName);
        workspace.extensions.newProjectRoot = '';
        const defaultProject = workspace.projects.get(appName);
        const oldSourceRoot = defaultProject.sourceRoot;
        const newRoot = core_1.join(core_1.normalize('apps'), appName);
        defaultProject.root = newRoot;
        defaultProject.sourceRoot = core_1.join(newRoot, 'src');
        function convertBuildOptions(buildOptions) {
            buildOptions.outputPath =
                buildOptions.outputPath && core_1.join(core_1.normalize('dist'), 'apps', appName);
            buildOptions.index =
                buildOptions.index && convertAsset(buildOptions.index);
            buildOptions.main =
                buildOptions.main && convertAsset(buildOptions.main);
            buildOptions.polyfills =
                buildOptions.polyfills &&
                    convertAsset(buildOptions.polyfills);
            buildOptions.tsConfig =
                buildOptions.tsConfig && core_1.join(newRoot, 'tsconfig.app.json');
            buildOptions.assets =
                buildOptions.assets &&
                    buildOptions.assets.map(convertAsset);
            buildOptions.styles =
                buildOptions.styles &&
                    buildOptions.styles.map(convertAsset);
            buildOptions.scripts =
                buildOptions.scripts &&
                    buildOptions.scripts.map(convertAsset);
            buildOptions.fileReplacements =
                buildOptions.fileReplacements &&
                    buildOptions.fileReplacements.map((replacement) => ({
                        replace: convertAsset(replacement.replace),
                        with: convertAsset(replacement.with),
                    }));
        }
        convertBuildOptions(defaultProject.targets.get('build').options);
        Object.values(defaultProject.targets.get('build').configurations).forEach((config) => convertBuildOptions(config));
        if (defaultProject.targets.has('test')) {
            const testOptions = defaultProject.targets.get('test').options;
            testOptions.main = testOptions.main && convertAsset(testOptions.main);
            testOptions.polyfills =
                testOptions.polyfills && convertAsset(testOptions.polyfills);
            testOptions.tsConfig = core_1.join(newRoot, 'tsconfig.spec.json');
            testOptions.karmaConfig = core_1.join(newRoot, 'karma.conf.js');
            testOptions.assets =
                testOptions.assets &&
                    testOptions.assets.map(convertAsset);
            testOptions.styles =
                testOptions.styles &&
                    testOptions.styles.map(convertAsset);
            testOptions.scripts =
                testOptions.scripts &&
                    testOptions.scripts.map(convertAsset);
        }
        const lintTarget = defaultProject.targets.get('lint');
        if (lintTarget) {
            lintTarget.options.tsConfig = [
                core_1.join(newRoot, 'tsconfig.app.json'),
                core_1.join(newRoot, 'tsconfig.spec.json'),
            ];
        }
        function convertServerOptions(serverOptions) {
            serverOptions.outputPath =
                serverOptions.outputPath &&
                    core_1.join(core_1.normalize('dist'), 'apps', options.name + '-server');
            serverOptions.main =
                serverOptions.main && convertAsset(serverOptions.main);
            serverOptions.tsConfig =
                serverOptions.tsConfig &&
                    core_1.join(core_1.normalize('apps'), appName, 'tsconfig.server.json');
            serverOptions.fileReplacements =
                serverOptions.fileReplacements &&
                    serverOptions.fileReplacements.map((replacement) => ({
                        replace: convertAsset(replacement.replace),
                        with: convertAsset(replacement.with),
                    }));
        }
        if (defaultProject.targets.has('server')) {
            const serverOptions = defaultProject.targets.get('server').options;
            convertServerOptions(serverOptions);
            Object.values(defaultProject.targets.get('server').configurations).forEach((config) => convertServerOptions(config));
        }
        function convertAsset(asset) {
            if (typeof asset === 'string') {
                return asset.startsWith(oldSourceRoot)
                    ? convertPath(appName, asset.replace(oldSourceRoot, 'src'))
                    : asset;
            }
            else {
                return Object.assign(Object.assign({}, asset), { input: asset.input && asset.input.startsWith(oldSourceRoot)
                        ? convertPath(appName, asset.input.replace(oldSourceRoot, 'src'))
                        : asset.input });
            }
        }
        if (defaultProject.targets.get('e2e')) {
            const lintTargetOptions = lintTarget ? lintTarget.options : {};
            const e2eProject = workspace.projects.add({
                name: e2eName,
                root: e2eRoot,
                projectType: 'application',
                targets: {
                    e2e: defaultProject.targets.get('e2e'),
                },
            });
            e2eProject.targets.add({
                name: 'lint',
                builder: '@angular-devkit/build-angular:tslint',
                options: Object.assign(Object.assign({}, lintTargetOptions), { tsConfig: core_1.join(e2eRoot, 'tsconfig.json') }),
            });
            e2eProject.targets.get('e2e').options.protractorConfig = core_1.join(e2eRoot, 'protractor.conf.js');
            defaultProject.targets.delete('e2e');
        }
    });
}
function updateTsConfig(options) {
    return (host) => {
        const tsConfigPath = getRootTsConfigPath(host);
        return workspace_1.updateJsonInTree(tsConfigPath, (tsConfigJson) => setUpCompilerOptions(tsConfigJson, options.npmScope, ''));
    };
}
function updateTsConfigsJson(options) {
    return (host) => {
        const workspaceJson = workspace_1.readJsonInTree(host, 'angular.json');
        const app = workspaceJson.projects[options.name];
        const e2eProject = getE2eProject(workspaceJson);
        const tsConfigPath = getRootTsConfigPath(host);
        const offset = '../../';
        return schematics_1.chain([
            workspace_1.updateJsonInTree(app.architect.build.options.tsConfig, (json) => {
                json.extends = `${offset}${tsConfigPath}`;
                json.compilerOptions = json.compilerOptions || {};
                json.compilerOptions.outDir = `${offset}dist/out-tsc`;
                return json;
            }),
            app.architect.test
                ? workspace_1.updateJsonInTree(app.architect.test.options.tsConfig, (json) => {
                    json.extends = `${offset}${tsConfigPath}`;
                    json.compilerOptions = json.compilerOptions || {};
                    json.compilerOptions.outDir = `${offset}dist/out-tsc`;
                    return json;
                })
                : schematics_1.noop(),
            app.architect.server
                ? workspace_1.updateJsonInTree(app.architect.server.options.tsConfig, (json) => {
                    json.compilerOptions = json.compilerOptions || {};
                    json.compilerOptions.outDir = `${offset}dist/out-tsc`;
                    return json;
                })
                : schematics_1.noop(),
            !!e2eProject
                ? workspace_1.updateJsonInTree(e2eProject.architect.lint.options.tsConfig, (json) => {
                    json.extends = `${workspace_1.offsetFromRoot(e2eProject.root)}${tsConfigPath}`;
                    json.compilerOptions = Object.assign(Object.assign({}, json.compilerOptions), { outDir: `${workspace_1.offsetFromRoot(e2eProject.root)}dist/out-tsc` });
                    return json;
                })
                : schematics_1.noop(),
        ]);
    };
}
function updateTsLint() {
    return workspace_1.updateJsonInTree('tslint.json', (tslintJson) => {
        [
            'no-trailing-whitespace',
            'one-line',
            'quotemark',
            'typedef-whitespace',
            'whitespace',
        ].forEach((key) => {
            tslintJson[key] = undefined;
        });
        tslintJson.rulesDirectory = tslintJson.rulesDirectory || [];
        tslintJson.rulesDirectory.push('node_modules/@nrwl/workspace/src/tslint');
        tslintJson.rules['nx-enforce-module-boundaries'] = [
            true,
            {
                allow: [],
                depConstraints: [{ sourceTag: '*', onlyDependOnLibsWithTags: ['*'] }],
            },
        ];
        return tslintJson;
    });
}
function updateProjectTsLint(options) {
    return (host) => {
        const workspaceJson = workspace_1.readJsonInTree(host, workspace_1.getWorkspacePath(host));
        const app = workspaceJson.projects[options.name];
        const offset = '../../';
        if (host.exists(`${app.root}/tslint.json`)) {
            return workspace_1.updateJsonInTree(`${app.root}/tslint.json`, (json) => {
                json.extends = `${offset}tslint.json`;
                return json;
            });
        }
        return host;
    };
}
function setUpCompilerOptions(tsconfig, npmScope, offset) {
    if (!tsconfig.compilerOptions.paths) {
        tsconfig.compilerOptions.paths = {};
    }
    tsconfig.compilerOptions.baseUrl = '.';
    tsconfig.compilerOptions.rootDir = '.';
    return tsconfig;
}
function moveOutOfSrc(tree, appName, filePath, context) {
    const filename = !!filePath ? path_1.basename(filePath) : '';
    const from = filePath;
    const to = core_1.join(core_1.normalize('apps'), appName, filename);
    workspace_1.renameSyncInTree(tree, from, to, (err) => {
        if (!context) {
            return;
        }
        else if (!err) {
            context.logger.info(`Renamed ${from} -> ${to}`);
        }
        else {
            context.logger.warn(err);
        }
    });
}
function getE2eKey(workspaceJson) {
    return Object.keys(workspaceJson.projects).find((key) => {
        return !!workspaceJson.projects[key].architect.e2e;
    });
}
function getE2eProject(workspaceJson) {
    const key = getE2eKey(workspaceJson);
    if (key) {
        return workspaceJson.projects[key];
    }
    else {
        return null;
    }
}
function moveExistingFiles(options) {
    return (host, context) => {
        const workspaceJson = workspace_1.readJsonInTree(host, workspace_1.getWorkspacePath(host));
        const app = workspaceJson.projects[options.name];
        const e2eApp = getE2eProject(workspaceJson);
        // No context is passed because it should not be required to have a browserslist
        moveOutOfSrc(host, options.name, 'browserslist');
        moveOutOfSrc(host, options.name, app.architect.build.options.tsConfig, context);
        if (app.architect.test) {
            moveOutOfSrc(host, options.name, app.architect.test.options.karmaConfig, context);
            moveOutOfSrc(host, options.name, app.architect.test.options.tsConfig, context);
        }
        else {
            // there could still be a karma.conf.js file in the root
            // so move to new location
            if (host.exists('karma.conf.js')) {
                context.logger.info('No test configuration, but root Karma config file found');
                moveOutOfSrc(host, options.name, 'karma.conf.js', context);
            }
        }
        if (app.architect.server) {
            moveOutOfSrc(host, options.name, app.architect.server.options.tsConfig, context);
        }
        const oldAppSourceRoot = app.sourceRoot;
        const newAppSourceRoot = core_1.join(core_1.normalize('apps'), options.name, 'src');
        workspace_1.renameDirSyncInTree(host, oldAppSourceRoot, newAppSourceRoot, (err) => {
            if (!err) {
                context.logger.info(`Renamed ${oldAppSourceRoot} -> ${newAppSourceRoot}`);
            }
            else {
                context.logger.error(err);
                throw err;
            }
        });
        if (e2eApp) {
            const oldE2eRoot = core_1.join(app.root, 'e2e');
            const newE2eRoot = core_1.join(core_1.normalize('apps'), getE2eKey(workspaceJson) + '-e2e');
            workspace_1.renameDirSyncInTree(host, oldE2eRoot, newE2eRoot, (err) => {
                if (!err) {
                    context.logger.info(`Renamed ${oldE2eRoot} -> ${newE2eRoot}`);
                }
                else {
                    context.logger.error(err);
                    throw err;
                }
            });
        }
        else {
            context.logger.warn('No e2e project was migrated because there was none declared in angular.json');
        }
        return host;
    };
}
function createAdditionalFiles(options) {
    return (host, _context) => {
        const workspaceJson = workspace_1.readJsonInTree(host, 'angular.json');
        const tsConfigPath = getRootTsConfigPath(host);
        host.create('nx.json', workspace_1.serializeJson({
            npmScope: options.npmScope,
            affected: {
                defaultBase: `${options.defaultBase}` || 'master',
            },
            implicitDependencies: {
                'angular.json': '*',
                'package.json': '*',
                [tsConfigPath]: '*',
                'tslint.json': '*',
                '.eslintrc.json': '*',
                'nx.json': '*',
            },
            projects: {
                [options.name]: {
                    tags: [],
                },
                [getE2eKey(workspaceJson) + '-e2e']: {
                    tags: [],
                },
            },
        }));
        host.create('libs/.gitkeep', '');
        host = workspace_1.updateJsonInTree('.vscode/extensions.json', (json) => {
            json.recommendations = json.recommendations || [];
            [
                'nrwl.angular-console',
                'angular.ng-template',
                'ms-vscode.vscode-typescript-tslint-plugin',
                'esbenp.prettier-vscode',
            ].forEach((extension) => {
                if (!json.recommendations.includes(extension)) {
                    json.recommendations.push(extension);
                }
            });
            return json;
        })(host, _context);
        // if the user does not already have a prettier configuration
        // of any kind, create one
        return rxjs_1.from(workspace_1.resolveUserExistingPrettierConfig()).pipe(operators_1.tap((existingPrettierConfig) => {
            if (!existingPrettierConfig) {
                host.create('.prettierrc', workspace_1.serializeJson(workspace_2.DEFAULT_NRWL_PRETTIER_CONFIG));
            }
        }), operators_1.mapTo(host));
    };
}
function checkCanConvertToWorkspace(options) {
    return (host, context) => {
        try {
            if (!host.exists('package.json')) {
                throw new Error('Cannot find package.json');
            }
            if (!host.exists('angular.json')) {
                throw new Error('Cannot find angular.json');
            }
            // TODO: This restriction should be lited
            const workspaceJson = workspace_1.readJsonInTree(host, 'angular.json');
            const hasLibraries = Object.keys(workspaceJson.projects).find((project) => workspaceJson.projects[project].projectType &&
                workspaceJson.projects[project].projectType !== 'application');
            if (Object.keys(workspaceJson.projects).length > 2 || hasLibraries) {
                throw new Error('Can only convert projects with one app');
            }
            const e2eKey = getE2eKey(workspaceJson);
            const e2eApp = getE2eProject(workspaceJson);
            if (e2eApp &&
                !host.exists(e2eApp.architect.e2e.options.protractorConfig)) {
                context.logger.info(`Make sure the ${e2eKey}.architect.e2e.options.protractorConfig is valid or the ${e2eKey} project is removed from angular.json.`);
                throw new Error(`An e2e project was specified but ${e2eApp.architect.e2e.options.protractorConfig} could not be found.`);
            }
            return host;
        }
        catch (e) {
            context.logger.error(e.message);
            context.logger.error('Your workspace could not be converted into an Nx Workspace because of the above error.');
            throw e;
        }
    };
}
const createNxJson = (host) => {
    const json = JSON.parse(host.read('angular.json').toString());
    const projects = json.projects || {};
    const hasLibraries = Object.keys(projects).find((project) => projects[project].projectType &&
        projects[project].projectType !== 'application');
    if (Object.keys(projects).length !== 1 || hasLibraries) {
        throw new Error(`The schematic can only be used with Angular CLI workspaces with a single application.`);
    }
    const name = Object.keys(projects)[0];
    const tsConfigPath = getRootTsConfigPath(host);
    host.create('nx.json', workspace_1.serializeJson({
        npmScope: name,
        implicitDependencies: {
            'angular.json': '*',
            'package.json': '*',
            [tsConfigPath]: '*',
            'tslint.json': '*',
            '.eslintrc.json': '*',
            'nx.json': '*',
        },
        projects: {
            [name]: {
                tags: [],
            },
        },
        tasksRunnerOptions: {
            default: {
                runner: '@nrwl/workspace/tasks-runners/default',
                options: {
                    cacheableOperations: ['build', 'lint', 'test', 'e2e'],
                },
            },
        },
    }));
};
const decorateAngularClI = (host, context) => {
    const decorateCli = fs_1.readFileSync(path_1.join(__dirname, '..', 'utils', 'decorate-angular-cli.js__tmpl__')).toString();
    host.create('decorate-angular-cli.js', decorateCli);
    workspace_1.updateJsonInTree('package.json', (json) => {
        if (json.scripts &&
            json.scripts.postinstall &&
            !json.scripts.postinstall.includes('decorate-angular-cli.js')) {
            // if exists, add execution of this script
            json.scripts.postinstall += ' && node ./decorate-angular-cli.js';
        }
        else {
            if (!json.scripts)
                json.scripts = {};
            // if doesn't exist, set to execute this script
            json.scripts.postinstall = 'node ./decorate-angular-cli.js';
        }
        if (json.scripts.ng) {
            json.scripts.ng = 'nx';
        }
        return json;
    })(host, context);
};
const addFiles = (host, context) => {
    const templateSource = schematics_1.apply(schematics_1.url('./files'), [
        schematics_1.filter((path) => !host.exists('/.prettierignore') || !(path === '/.prettierignore')),
        schematics_1.template({
            tmpl: '',
        }),
    ]);
    return schematics_1.chain([schematics_1.mergeWith(templateSource)])(host, context);
};
function default_1(schema) {
    if (schema.preserveAngularCLILayout) {
        return schematics_1.chain([
            workspace_1.addDepsToPackageJson({}, { '@nrwl/workspace': versions_1.nxVersion }),
            createNxJson,
            decorateAngularClI,
        ]);
    }
    else {
        const options = Object.assign(Object.assign({}, schema), { npmScope: workspace_1.toFileName(schema.npmScope || schema.name) });
        return schematics_1.chain([
            checkCanConvertToWorkspace(options),
            moveExistingFiles(options),
            addFiles,
            createAdditionalFiles(options),
            updatePackageJson(),
            updateAngularCLIJson(options),
            updateTsLint(),
            updateProjectTsLint(options),
            updateTsConfig(options),
            updateTsConfigsJson(options),
            decorateAngularClI,
            workspace_1.addInstallTask(options),
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=init.js.map