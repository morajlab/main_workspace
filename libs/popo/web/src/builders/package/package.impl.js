"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRollupOptions = exports.run = void 0;
const path_1 = require("path");
const architect_1 = require("@angular-devkit/architect");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const plugin_babel_1 = require("@rollup/plugin-babel");
const autoprefixer = require("autoprefixer");
const rollup = require("rollup");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const localResolve = require("rollup-plugin-local-resolve");
const name_utils_1 = require("@nrwl/workspace/src/utils/name-utils");
const fileutils_1 = require("@nrwl/workspace/src/utils/fileutils");
const project_graph_1 = require("@nrwl/workspace/src/core/project-graph");
const buildable_libs_utils_1 = require("@nrwl/workspace/src/utils/buildable-libs-utils");
const run_rollup_1 = require("./run-rollup");
const normalize_1 = require("../../utils/normalize");
const source_root_1 = require("../../utils/source-root");
const delete_output_dir_1 = require("../../utils/delete-output-dir");
// These use require because the ES import isn't correct.
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const image = require('@rollup/plugin-image');
const json = require('@rollup/plugin-json');
const copy = require('rollup-plugin-copy');
const postcss = require('rollup-plugin-postcss');
const filesize = require('rollup-plugin-filesize');
exports.default = architect_1.createBuilder(run);
const outputConfigs = [
    { format: 'umd', extension: 'umd' },
    { format: 'esm', extension: 'esm' },
];
const fileExtensions = ['.js', '.jsx', '.ts', '.tsx'];
function run(rawOptions, context) {
    const projGraph = project_graph_1.createProjectGraph();
    const { target, dependencies } = buildable_libs_utils_1.calculateProjectDependencies(projGraph, context);
    return rxjs_1.from(source_root_1.getSourceRoot(context)).pipe(operators_1.switchMap((sourceRoot) => {
        if (!buildable_libs_utils_1.checkDependentProjectsHaveBeenBuilt(context, dependencies)) {
            return rxjs_1.of({ success: false });
        }
        const options = normalize_1.normalizePackageOptions(rawOptions, context.workspaceRoot, sourceRoot);
        const packageJson = fileutils_1.readJsonFile(options.project);
        const rollupOptions = createRollupOptions(options, dependencies, context, packageJson, sourceRoot);
        if (options.watch) {
            return new rxjs_1.Observable((obs) => {
                const watcher = rollup.watch(rollupOptions);
                watcher.on('event', (data) => {
                    if (data.code === 'START') {
                        context.logger.info('Bundling...');
                    }
                    else if (data.code === 'END') {
                        updatePackageJson(options, context, target, dependencies, packageJson);
                        context.logger.info('Bundle complete. Watching for file changes...');
                        obs.next({ success: true });
                    }
                    else if (data.code === 'ERROR') {
                        context.logger.error(`Error during bundle: ${data.error.message}`);
                        obs.next({ success: false });
                    }
                });
                // Teardown logic. Close watcher when unsubscribed.
                return () => watcher.close();
            });
        }
        else {
            context.logger.info(`Bundling...`);
            // Delete output path before bundling
            delete_output_dir_1.deleteOutputDir(context.workspaceRoot, options.outputPath);
            return rxjs_1.from(rollupOptions).pipe(operators_1.concatMap((opts) => run_rollup_1.runRollup(opts).pipe(operators_1.catchError((e) => {
                context.logger.error(`Error during bundle: ${e}`);
                return rxjs_1.of({ success: false });
            }), operators_1.last(), operators_1.tap({
                next: (result) => {
                    if (result.success) {
                        updatePackageJson(options, context, target, dependencies, packageJson);
                        context.logger.info('Bundle complete.');
                    }
                    else {
                        context.logger.error('Bundle failed.');
                    }
                },
            }))));
        }
    }));
}
exports.run = run;
// -----------------------------------------------------------------------------
function createRollupOptions(options, dependencies, context, packageJson, sourceRoot) {
    return outputConfigs.map((config) => {
        const compilerOptionPaths = buildable_libs_utils_1.computeCompilerOptionsPaths(options.tsConfig, dependencies);
        const plugins = [
            copy({
                targets: convertCopyAssetsToRollupOptions(options.outputPath, options.assets),
            }),
            image(),
            typescript({
                check: true,
                tsconfig: options.tsConfig,
                tsconfigOverride: {
                    compilerOptions: {
                        rootDir: options.entryRoot,
                        allowJs: false,
                        declaration: true,
                        paths: compilerOptionPaths,
                        target: config.format === 'esm' ? undefined : 'es5',
                    },
                },
            }),
            peerDepsExternal({
                packageJsonPath: options.project,
            }),
            postcss({
                inject: true,
                extract: options.extractCss,
                autoModules: true,
                plugins: [autoprefixer],
            }),
            localResolve(),
            resolve({
                preferBuiltins: true,
                extensions: fileExtensions,
            }),
            plugin_babel_1.getBabelInputPlugin({
                cwd: path_1.join(context.workspaceRoot, sourceRoot),
                rootMode: 'upward',
                babelrc: true,
                extensions: fileExtensions,
                babelHelpers: 'bundled',
                exclude: /node_modules/,
                plugins: [
                    config.format === 'esm'
                        ? undefined
                        : 'babel-plugin-transform-async-to-promises',
                ].filter(Boolean),
            }),
            commonjs(),
            filesize(),
            json(),
        ];
        const globals = options.globals
            ? options.globals.reduce((acc, item) => {
                acc[item.moduleId] = item.global;
                return acc;
            }, {})
            : {};
        const externalPackages = dependencies
            .map((d) => d.name)
            .concat(options.external || [])
            .concat(Object.keys(packageJson.dependencies || {}));
        const rollupConfig = {
            input: options.entryFile,
            output: {
                globals,
                format: config.format,
                file: `${options.outputPath}/${context.target.project}.${config.extension}.js`,
                name: options.umdName || name_utils_1.toClassName(context.target.project),
            },
            external: (id) => externalPackages.includes(id),
            plugins,
        };
        return options.rollupConfig
            ? require(options.rollupConfig)(rollupConfig, options)
            : rollupConfig;
    });
}
exports.createRollupOptions = createRollupOptions;
function updatePackageJson(options, context, target, dependencies, packageJson) {
    const entryFileTmpl = `./${context.target.project}.<%= extension %>.js`;
    const typingsFile = path_1.relative(options.entryRoot, options.entryFile).replace(/\.[jt]sx?$/, '.d.ts');
    packageJson.main = entryFileTmpl.replace('<%= extension %>', 'umd');
    packageJson.module = entryFileTmpl.replace('<%= extension %>', 'esm');
    packageJson.typings = `./${typingsFile}`;
    fileutils_1.writeJsonFile(`${options.outputPath}/package.json`, packageJson);
    if (dependencies.length > 0 &&
        options.updateBuildableProjectDepsInPackageJson) {
        buildable_libs_utils_1.updateBuildableProjectPackageJsonDependencies(context, target, dependencies, options.buildableProjectDepsInPackageJsonType);
    }
}
function convertCopyAssetsToRollupOptions(outputPath, assets) {
    return assets
        ? assets.map((a) => ({
            src: path_1.join(a.input, a.glob).replace(/\\/g, '/'),
            dest: path_1.join(outputPath, a.output).replace(/\\/g, '/'),
        }))
        : undefined;
}
//# sourceMappingURL=package.impl.js.map