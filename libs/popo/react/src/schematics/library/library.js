"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const react_1 = require("@nrwl/react");
const workspace_1 = require("@nrwl/workspace");
const to_js_1 = require("@nrwl/workspace/src/utils/rules/to-js");
const ts = require("typescript");
const assertion_1 = require("../../utils/assertion");
const ast_utils_1 = require("../../utils/ast-utils");
const lint_1 = require("../../utils/lint");
const versions_1 = require("../../utils/versions");
const ast_utils_2 = require("@nrwl/workspace/src/utils/ast-utils");
const rules_1 = require("@nrwl/web/src/utils/rules");
const update_babel_jest_config_1 = require("../../rules/update-babel-jest-config");
function default_1(schema) {
    return (host, context) => {
        const options = normalizeOptions(host, schema);
        if (options.publishable === true && !schema.importPath) {
            throw new schematics_1.SchematicsException(`For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`);
        }
        if (!options.component) {
            options.style = 'none';
        }
        return schematics_1.chain([
            workspace_1.addLintFiles(options.projectRoot, options.linter, {
                localConfig: lint_1.reactEslintJson,
                extraPackageDeps: lint_1.extraEslintDependencies,
            }),
            createFiles(options),
            !options.skipTsConfig ? updateTsConfig(options) : schematics_1.noop(),
            addProject(options),
            updateNxJson(options),
            options.unitTestRunner !== 'none'
                ? schematics_1.chain([
                    schematics_1.externalSchematic('@nrwl/jest', 'jest-project', {
                        project: options.name,
                        setupFile: 'none',
                        supportTsx: true,
                        skipSerializers: true,
                        babelJest: true,
                    }),
                    update_babel_jest_config_1.updateBabelJestConfig(options.projectRoot, (json) => {
                        if (options.style === 'styled-jsx') {
                            json.plugins = (json.plugins || []).concat('styled-jsx/babel');
                        }
                        return json;
                    }),
                ])
                : schematics_1.noop(),
            options.component
                ? schematics_1.externalSchematic('@nrwl/react', 'component', {
                    name: options.name,
                    project: options.name,
                    flat: true,
                    style: options.style,
                    skipTests: options.unitTestRunner === 'none',
                    export: true,
                    routing: options.routing,
                    js: options.js,
                    pascalCaseFiles: options.pascalCaseFiles,
                })
                : schematics_1.noop(),
            options.publishable ? updateLibPackageNpmScope(options) : schematics_1.noop(),
            workspace_1.addDepsToPackageJson({
                react: versions_1.reactVersion,
                'react-dom': versions_1.reactDomVersion,
            }, {}),
            updateAppRoutes(options, context),
            rules_1.initRootBabelConfig(),
            workspace_1.formatFiles(options),
        ])(host, context);
    };
}
exports.default = default_1;
function addProject(options) {
    return workspace_1.updateWorkspaceInTree((json, context, host) => {
        const architect = {};
        architect.lint = workspace_1.generateProjectLint(core_1.normalize(options.projectRoot), core_1.join(core_1.normalize(options.projectRoot), 'tsconfig.lib.json'), options.linter, [`${options.projectRoot}/**/*.{ts,tsx,js,jsx}`]);
        if (options.publishable || options.buildable) {
            const external = ['react', 'react-dom'];
            // Also exclude CSS-in-JS packages from build
            if (options.style !== 'css' &&
                options.style !== 'scss' &&
                options.style !== 'styl' &&
                options.style !== 'less' &&
                options.style !== 'none') {
                external.push(...Object.keys(react_1.CSS_IN_JS_DEPENDENCIES[options.style].dependencies));
            }
            architect.build = {
                builder: '@nrwl/web:package',
                options: {
                    outputPath: `dist/${ast_utils_2.libsDir(host)}/${options.projectDirectory}`,
                    tsConfig: `${options.projectRoot}/tsconfig.lib.json`,
                    project: `${options.projectRoot}/package.json`,
                    entryFile: maybeJs(options, `${options.projectRoot}/src/index.ts`),
                    external,
                    babelConfig: `@nrwl/react/plugins/bundle-babel`,
                    rollupConfig: `@nrwl/react/plugins/bundle-rollup`,
                    assets: [
                        {
                            glob: 'README.md',
                            input: '.',
                            output: '.',
                        },
                    ],
                },
            };
        }
        json.projects[options.name] = {
            root: options.projectRoot,
            sourceRoot: core_1.join(core_1.normalize(options.projectRoot), 'src'),
            projectType: 'library',
            schematics: {},
            architect,
        };
        return json;
    });
}
function updateTsConfig(options) {
    return schematics_1.chain([
        (host, context) => {
            const nxJson = workspace_1.readJsonInTree(host, 'nx.json');
            return workspace_1.updateJsonInTree('tsconfig.base.json', (json) => {
                const c = json.compilerOptions;
                c.paths = c.paths || {};
                delete c.paths[options.name];
                if (c.paths[options.importPath]) {
                    throw new schematics_1.SchematicsException(`You already have a library using the import path "${options.importPath}". Make sure to specify a unique one.`);
                }
                c.paths[options.importPath] = [
                    maybeJs(options, `${ast_utils_2.libsDir(host)}/${options.projectDirectory}/src/index.ts`),
                ];
                return json;
            })(host, context);
        },
    ]);
}
function createFiles(options) {
    return schematics_1.mergeWith(schematics_1.apply(schematics_1.url(`./files/lib`), [
        schematics_1.template(Object.assign(Object.assign(Object.assign({}, options), workspace_1.names(options.name)), { tmpl: '', offsetFromRoot: workspace_1.offsetFromRoot(options.projectRoot) })),
        schematics_1.move(options.projectRoot),
        options.publishable || options.buildable
            ? schematics_1.noop()
            : schematics_1.filter((file) => !file.endsWith('package.json')),
        options.js ? to_js_1.toJS() : schematics_1.noop(),
    ]));
}
function updateNxJson(options) {
    return workspace_1.updateJsonInTree('nx.json', (json) => {
        json.projects[options.name] = { tags: options.parsedTags };
        return json;
    });
}
function updateAppRoutes(options, context) {
    if (!options.appMain || !options.appSourceRoot) {
        return schematics_1.noop();
    }
    return (host) => {
        const { source } = readComponent(host, options.appMain);
        const componentImportPath = ast_utils_1.findComponentImportPath('App', source);
        if (!componentImportPath) {
            throw new Error(`Could not find App component in ${options.appMain} (Hint: you can omit --appProject, or make sure App exists)`);
        }
        const appComponentPath = core_1.join(options.appSourceRoot, maybeJs(options, `${componentImportPath}.tsx`));
        return schematics_1.chain([
            workspace_1.addDepsToPackageJson({ 'react-router-dom': versions_1.reactRouterDomVersion }, { '@types/react-router-dom': versions_1.typesReactRouterDomVersion }),
            function addBrowserRouterToMain(host) {
                const { content, source } = readComponent(host, options.appMain);
                const isRouterPresent = content.match(/react-router-dom/);
                if (!isRouterPresent) {
                    workspace_1.insert(host, options.appMain, ast_utils_1.addBrowserRouter(options.appMain, source, context));
                }
            },
            function addInitialAppRoutes(host) {
                const { content, source } = readComponent(host, appComponentPath);
                const isRouterPresent = content.match(/react-router-dom/);
                if (!isRouterPresent) {
                    workspace_1.insert(host, appComponentPath, ast_utils_1.addInitialRoutes(appComponentPath, source, context));
                }
            },
            function addNewAppRoute(host) {
                const npmScope = workspace_1.getNpmScope(host);
                const { source: componentSource } = readComponent(host, appComponentPath);
                workspace_1.insert(host, appComponentPath, ast_utils_1.addRoute(appComponentPath, componentSource, {
                    routePath: options.routePath,
                    componentName: workspace_1.toClassName(options.name),
                    moduleName: `@${npmScope}/${options.projectDirectory}`,
                }, context));
            },
            workspace_1.addDepsToPackageJson({ 'react-router-dom': versions_1.reactRouterDomVersion }, {}),
        ]);
    };
}
function readComponent(host, path) {
    if (!host.exists(path)) {
        throw new Error(`Cannot find ${path}`);
    }
    const content = host.read(path).toString('utf-8');
    const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
    return { content, source };
}
function normalizeOptions(host, options) {
    const name = workspace_1.toFileName(options.name);
    const projectDirectory = options.directory
        ? `${workspace_1.toFileName(options.directory)}/${name}`
        : name;
    const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
    const fileName = projectName;
    const projectRoot = core_1.normalize(`${ast_utils_2.libsDir(host)}/${projectDirectory}`);
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : [];
    const importPath = options.importPath || `@${workspace_1.getNpmScope(host)}/${projectDirectory}`;
    const normalized = Object.assign(Object.assign({}, options), { fileName, routePath: `/${name}`, name: projectName, projectRoot,
        projectDirectory,
        parsedTags,
        importPath });
    if (options.appProject) {
        const appProjectConfig = workspace_1.getProjectConfig(host, options.appProject);
        if (appProjectConfig.projectType !== 'application') {
            throw new Error(`appProject expected type of "application" but got "${appProjectConfig.projectType}"`);
        }
        try {
            normalized.appMain = appProjectConfig.architect.build.options.main;
            normalized.appSourceRoot = core_1.normalize(appProjectConfig.sourceRoot);
        }
        catch (e) {
            throw new Error(`Could not locate project main for ${options.appProject}`);
        }
    }
    assertion_1.assertValidStyle(normalized.style);
    return normalized;
}
function updateLibPackageNpmScope(options) {
    return workspace_1.updateJsonInTree(`${options.projectRoot}/package.json`, (json) => {
        json.name = options.importPath;
        return json;
    });
}
function maybeJs(options, path) {
    return options.js && (path.endsWith('.ts') || path.endsWith('.tsx'))
        ? path.replace(/\.tsx?$/, '.js')
        : path;
}
//# sourceMappingURL=library.js.map