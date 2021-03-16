"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular-devkit/core");
const ts = require("typescript");
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const ast_utils_1 = require("@nrwl/workspace/src/utils/ast-utils");
const versions_1 = require("../../utils/versions");
const assertion_1 = require("../../utils/assertion");
const to_js_1 = require("@nrwl/workspace/src/utils/rules/to-js");
const add_styled_dependencies_1 = require("../../rules/add-styled-dependencies");
function default_1(schema) {
    return (host, context) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const options = yield normalizeOptions(host, schema, context);
        return schematics_1.chain([
            createComponentFiles(options),
            add_styled_dependencies_1.addStyledModuleDependencies(options.styledModule),
            addExportsToBarrel(options),
            options.routing
                ? ast_utils_1.addDepsToPackageJson({ 'react-router-dom': versions_1.reactRouterDomVersion }, { '@types/react-router-dom': versions_1.typesReactRouterDomVersion })
                : schematics_1.noop(),
            workspace_1.formatFiles({ skipFormat: false }),
        ]);
    });
}
exports.default = default_1;
function createComponentFiles(options) {
    const componentDir = core_1.join(options.projectSourceRoot, options.directory);
    return schematics_1.mergeWith(schematics_1.apply(schematics_1.url(`./files`), [
        schematics_1.template(Object.assign(Object.assign({}, options), { tmpl: '' })),
        options.skipTests ? schematics_1.filter((file) => !/.*spec.tsx/.test(file)) : schematics_1.noop(),
        options.styledModule || !options.hasStyles
            ? schematics_1.filter((file) => !file.endsWith(`.${options.style}`))
            : schematics_1.noop(),
        schematics_1.move(componentDir),
        options.js ? to_js_1.toJS() : schematics_1.noop(),
    ]));
}
function addExportsToBarrel(options) {
    return (host) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const workspace = yield workspace_1.getWorkspace(host);
        const isApp = workspace.projects.get(options.project).extensions.type === 'application';
        return options.export && !isApp
            ? (host) => {
                const indexFilePath = core_1.join(options.projectSourceRoot, options.js ? 'index.js' : 'index.ts');
                const buffer = host.read(indexFilePath);
                if (!!buffer) {
                    const indexSource = buffer.toString('utf-8');
                    const indexSourceFile = ts.createSourceFile(indexFilePath, indexSource, ts.ScriptTarget.Latest, true);
                    ast_utils_1.insert(host, indexFilePath, ast_utils_1.addGlobal(indexSourceFile, indexFilePath, `export * from './${options.directory}/${options.fileName}';`));
                }
                return host;
            }
            : schematics_1.noop();
    });
}
function normalizeOptions(host, options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        assertValidOptions(options);
        const { className, fileName } = workspace_1.names(options.name);
        const componentFileName = options.pascalCaseFiles ? className : fileName;
        const { sourceRoot: projectSourceRoot, projectType } = ast_utils_1.getProjectConfig(host, options.project);
        const directory = yield getDirectory(host, options);
        const styledModule = /^(css|scss|less|styl|none)$/.test(options.style)
            ? null
            : options.style;
        if (options.export && projectType === 'application') {
            context.logger.warn(`The "--export" option should not be used with applications and will do nothing.`);
        }
        return Object.assign(Object.assign({}, options), { directory,
            styledModule, hasStyles: options.style !== 'none', className, fileName: componentFileName, projectSourceRoot });
    });
}
function getDirectory(host, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const fileName = workspace_1.toFileName(options.name);
        const workspace = yield workspace_1.getWorkspace(host);
        let baseDir;
        if (options.directory) {
            baseDir = options.directory;
        }
        else {
            baseDir =
                workspace.projects.get(options.project).extensions.projectType ===
                    'application'
                    ? 'app'
                    : 'lib';
        }
        return options.flat ? baseDir : core_1.join(core_1.normalize(baseDir), fileName);
    });
}
function assertValidOptions(options) {
    assertion_1.assertValidStyle(options.style);
    const slashes = ['/', '\\'];
    slashes.forEach((s) => {
        if (options.name.indexOf(s) !== -1) {
            const [name, ...rest] = options.name.split(s).reverse();
            let suggestion = rest.map((x) => x.toLowerCase()).join(s);
            if (options.directory) {
                suggestion = `${options.directory}${s}${suggestion}`;
            }
            throw new Error(`Found "${s}" in the component name. Did you mean to use the --directory option (e.g. \`nx g c ${name} --directory ${suggestion}\`)?`);
        }
    });
}
//# sourceMappingURL=component.js.map