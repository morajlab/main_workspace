"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAllStories = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const workspace_1 = require("@nrwl/workspace");
const ast_utils_1 = require("../../utils/ast-utils");
const ts = require("typescript");
const project_type_1 = require("@nrwl/workspace/src/utils/project-type");
function containsComponentDeclaration(tree, componentPath) {
    const contents = tree.read(componentPath);
    if (!contents) {
        throw new schematics_1.SchematicsException(`Failed to read ${componentPath}`);
    }
    const sourceFile = ts.createSourceFile(componentPath, contents.toString(), ts.ScriptTarget.Latest, true);
    return !!ast_utils_1.getComponentName(sourceFile);
}
function createAllStories(projectName, generateCypressSpecs, js) {
    return (tree, context) => {
        const projectSrcRoot = workspace_1.getProjectConfig(tree, projectName).sourceRoot;
        const libPath = project_type_1.projectRootPath(tree, projectName);
        let componentPaths = [];
        tree.getDir(libPath).visit((filePath) => {
            if ((filePath.endsWith('.tsx') && !filePath.endsWith('.spec.tsx')) ||
                (filePath.endsWith('.js') && !filePath.endsWith('.spec.js')) ||
                (filePath.endsWith('.jsx') && !filePath.endsWith('.spec.jsx'))) {
                componentPaths.push(filePath);
            }
        });
        return schematics_1.chain(componentPaths.map((componentPath) => {
            const relativeCmpDir = componentPath.replace(core_1.join('/', projectSrcRoot, '/'), '');
            if (!containsComponentDeclaration(tree, componentPath)) {
                return schematics_1.chain([schematics_1.noop()]);
            }
            return schematics_1.chain([
                schematics_1.schematic('component-story', {
                    componentPath: relativeCmpDir,
                    project: projectName,
                }),
                generateCypressSpecs
                    ? schematics_1.schematic('component-cypress-spec', {
                        project: projectName,
                        componentPath: relativeCmpDir,
                        js,
                    })
                    : () => { },
            ]);
        }));
    };
}
exports.createAllStories = createAllStories;
function default_1(schema) {
    return schematics_1.chain([
        createAllStories(schema.project, schema.generateCypressSpecs, schema.js),
    ]);
}
exports.default = default_1;
//# sourceMappingURL=stories.js.map