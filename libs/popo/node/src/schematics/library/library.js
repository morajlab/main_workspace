"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.libraryGenerator = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const ast_utils_1 = require("@nrwl/workspace/src/utils/ast-utils");
const to_js_1 = require("@nrwl/workspace/src/utils/rules/to-js");
const devkit_1 = require("@nrwl/devkit");
const ngcli_adapter_1 = require("@nrwl/devkit/ngcli-adapter");
function default_1(schema) {
    return (host, context) => {
        const options = normalizeOptions(host, schema);
        if (options.publishable === true && !schema.importPath) {
            throw new schematics_1.SchematicsException(`For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`);
        }
        return schematics_1.chain([
            schematics_1.externalSchematic('@nrwl/workspace', 'lib', Object.assign(Object.assign({}, schema), { importPath: options.importPath })),
            createFiles(options),
            options.js ? to_js_1.updateTsConfigsToJs(options) : schematics_1.noop(),
            addProject(options),
            workspace_1.formatFiles(options),
        ]);
    };
}
exports.default = default_1;
function normalizeOptions(host, options) {
    const defaultPrefix = workspace_1.getNpmScope(host);
    const name = devkit_1.names(options.name).fileName;
    const projectDirectory = options.directory
        ? `${devkit_1.names(options.directory).fileName}/${name}`
        : name;
    const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
    const fileName = projectName;
    const projectRoot = core_1.normalize(`${ast_utils_1.libsDir(host)}/${projectDirectory}`);
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : [];
    const importPath = options.importPath || `@${defaultPrefix}/${projectDirectory}`;
    return Object.assign(Object.assign({}, options), { prefix: defaultPrefix, // we could also allow customizing this
        fileName, name: projectName, projectRoot,
        projectDirectory,
        parsedTags,
        importPath });
}
function createFiles(options) {
    return schematics_1.mergeWith(schematics_1.apply(schematics_1.url(`./files/lib`), [
        schematics_1.template(Object.assign(Object.assign(Object.assign({}, options), devkit_1.names(options.name)), { tmpl: '', offsetFromRoot: devkit_1.offsetFromRoot(options.projectRoot) })),
        schematics_1.move(options.projectRoot),
        options.unitTestRunner === 'none'
            ? schematics_1.filter((file) => !file.endsWith('spec.ts'))
            : schematics_1.noop(),
        options.publishable || options.buildable
            ? schematics_1.noop()
            : schematics_1.filter((file) => !file.endsWith('package.json')),
        options.js ? to_js_1.toJS() : schematics_1.noop(),
    ]), schematics_1.MergeStrategy.Overwrite);
}
function addProject(options) {
    if (!options.publishable && !options.buildable) {
        return schematics_1.noop();
    }
    return workspace_1.updateWorkspaceInTree((json, context, host) => {
        const architect = json.projects[options.name].architect;
        if (architect) {
            architect.build = {
                builder: '@nrwl/node:package',
                outputs: ['{options.outputPath}'],
                options: {
                    outputPath: `dist/${ast_utils_1.libsDir(host)}/${options.projectDirectory}`,
                    tsConfig: `${options.projectRoot}/tsconfig.lib.json`,
                    packageJson: `${options.projectRoot}/package.json`,
                    main: to_js_1.maybeJs(options, `${options.projectRoot}/src/index.ts`),
                    assets: [`${options.projectRoot}/*.md`],
                },
            };
            if (options.rootDir) {
                architect.build.options.srcRootForCompilationRoot = options.rootDir;
            }
        }
        return json;
    });
}
exports.libraryGenerator = ngcli_adapter_1.wrapAngularDevkitSchematic('@nrwl/node', 'library');
//# sourceMappingURL=library.js.map