"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponentSpecFile = exports.getKnobDefaultValue = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const core_2 = require("@angular-devkit/core");
const workspace_1 = require("@nrwl/workspace");
const ast_utils_1 = require("@nrwl/workspace/src/utils/ast-utils");
const ts = require("typescript");
const ast_utils_2 = require("../../utils/ast-utils");
function default_1(schema) {
    return schematics_1.chain([createComponentSpecFile(schema)]);
}
exports.default = default_1;
// TODO: candidate to refactor with the angular component story
function getKnobDefaultValue(property) {
    const typeNameToDefault = {
        [ts.SyntaxKind.StringKeyword]: '',
        [ts.SyntaxKind.NumberKeyword]: 0,
        [ts.SyntaxKind.BooleanKeyword]: false,
    };
    const resolvedValue = typeNameToDefault[property];
    if (typeof resolvedValue === undefined) {
        return '';
    }
    else {
        return resolvedValue;
    }
}
exports.getKnobDefaultValue = getKnobDefaultValue;
function createComponentSpecFile({ project, componentPath, js, }) {
    return (tree, context) => {
        const e2eLibIntegrationFolderPath = workspace_1.getProjectConfig(tree, project + '-e2e').sourceRoot + '/integration';
        const proj = workspace_1.getProjectConfig(tree, project);
        const componentFilePath = core_1.normalize(core_2.join(proj.sourceRoot, componentPath));
        const componentName = componentFilePath
            .slice(componentFilePath.lastIndexOf('/') + 1)
            .replace('.tsx', '')
            .replace('.jsx', '')
            .replace('.js', '');
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
        let props = [];
        if (propsInterface) {
            props = propsInterface.members.map((member) => {
                return {
                    name: member.name.text,
                    defaultValue: getKnobDefaultValue(member.type.kind),
                };
            });
        }
        return ast_utils_1.applyWithSkipExisting(schematics_1.url('./files'), [
            schematics_1.applyTemplates({
                projectName: project,
                componentName,
                componentSelector: cmpDeclaration.name.text,
                props,
                fileExt: js ? 'js' : 'ts',
            }),
            schematics_1.move(e2eLibIntegrationFolderPath + '/' + componentName),
        ]);
    };
}
exports.createComponentSpecFile = createComponentSpecFile;
//# sourceMappingURL=component-cypress-spec.js.map