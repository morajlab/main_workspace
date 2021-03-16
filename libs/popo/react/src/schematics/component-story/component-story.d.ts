import { Rule } from '@angular-devkit/schematics';
import * as ts from 'typescript';
export interface CreateComponentStoriesFileSchema {
    project: string;
    componentPath: string;
}
export declare type KnobType = 'text' | 'boolean' | 'number' | 'select';
export declare function getKnobDefaultValue(property: ts.SyntaxKind): string;
export declare function createComponentStoriesFile({ project, componentPath, }: CreateComponentStoriesFileSchema): Rule;
export default function (schema: CreateComponentStoriesFileSchema): Rule;
