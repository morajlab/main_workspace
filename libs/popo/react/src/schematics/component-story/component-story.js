"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponentStoriesFile = exports.getKnobDefaultValue = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const workspace_1 = require("@nrwl/workspace");
const ast_utils_1 = require("@nrwl/workspace/src/utils/ast-utils");
const ts = require("typescript");
const ast_utils_2 = require("../../utils/ast-utils");
// TODO: candidate to refactor with the angular component story
function getKnobDefaultValue(property) {
    const typeNameToDefault = {
        [ts.SyntaxKind.StringKeyword]: "''",
        [ts.SyntaxKind.NumberKeyword]: 0,
        [ts.SyntaxKind.BooleanKeyword]: false,
    };
    const resolvedValue = typeNameToDefault[property];
    if (typeof resolvedValue === undefined) {
        return "''";
    }
    else {
        return resolvedValue;
    }
}
exports.getKnobDefaultValue = getKnobDefaultValue;
function createComponentStoriesFile({ 
// name,
project, componentPath, }) {
    return (tree, context) => {
        const proj = workspace_1.getProjectConfig(tree, project);
        const sourceRoot = proj.sourceRoot;
        // TODO: Remove this entirely, given we don't support TSLint with React?
        const usesEsLint = true;
        const componentFilePath = core_1.normalize(core_1.join(sourceRoot, componentPath));
        const componentDirectory = componentFilePath.replace(componentFilePath.slice(componentFilePath.lastIndexOf('/')), '');
        const isPlainJs = componentFilePath.endsWith('.jsx');
        let fileExt = 'tsx';
        if (componentFilePath.endsWith('.jsx')) {
            fileExt = 'jsx';
        }
        else if (componentFilePath.endsWith('.js')) {
            fileExt = 'js';
        }
        const componentFileName = componentFilePath
            .slice(componentFilePath.lastIndexOf('/') + 1)
            .replace('.tsx', '')
            .replace('.jsx', '')
            .replace('.js', '');
        const name = componentFileName;
        const contents = tree.read(componentFilePath);
        if (!contents) {
            throw new schematics_1.SchematicsException(`Failed to read ${componentFilePath}`);
        }
        const sourceFile = ts.createSourceFile(componentFilePath, contents.toString(), ts.ScriptTarget.Latest, true);
        const cmpDeclaration = ast_utils_2.getComponentName(sourceFile);
        if (!cmpDeclaration) {
            throw new schematics_1.SchematicsException(`Could not find any React component in file ${componentFilePath}`);
        }
        const propsInterface = ast_utils_2.getComponentPropsInterface(sourceFile);
        let propsTypeName = null;
        let props = [];
        if (propsInterface) {
            propsTypeName = propsInterface.name.text;
            props = propsInterface.members.map((member) => {
                const initializerKindToKnobType = {
                    [ts.SyntaxKind.StringKeyword]: 'text',
                    [ts.SyntaxKind.NumberKeyword]: 'number',
                    [ts.SyntaxKind.BooleanKeyword]: 'boolean',
                };
                return {
                    name: member.name.text,
                    type: initializerKindToKnobType[member.type.kind],
                    defaultValue: getKnobDefaultValue(member.type.kind),
                };
            });
        }
        return schematics_1.chain([
            ast_utils_1.applyWithSkipExisting(schematics_1.url('./files'), [
                schematics_1.applyTemplates({
                    componentFileName: name,
                    propsTypeName,
                    props,
                    usedKnobs: props.map((x) => x.type).join(', '),
                    componentName: cmpDeclaration.name.text,
                    isPlainJs,
                    fileExt,
                    usesEsLint,
                }),
                schematics_1.move(core_1.normalize(componentDirectory)),
            ]),
        ]);
    };
}
exports.createComponentStoriesFile = createComponentStoriesFile;
function default_1(schema) {
    return schematics_1.chain([createComponentStoriesFile(schema), workspace_1.formatFiles()]);
}
exports.default = default_1;
//# sourceMappingURL=component-story.js.map