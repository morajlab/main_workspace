import { Rule } from '@angular-devkit/schematics';
import ts = require('typescript');
export interface CreateComponentSpecFileSchema {
    project: string;
    componentPath: string;
    js?: boolean;
}
export default function (schema: CreateComponentSpecFileSchema): Rule;
export declare function getKnobDefaultValue(property: ts.SyntaxKind): string;
export declare function createComponentSpecFile({ project, componentPath, js, }: CreateComponentSpecFileSchema): Rule;
