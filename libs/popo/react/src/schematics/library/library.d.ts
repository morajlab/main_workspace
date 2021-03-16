import { Path } from '@angular-devkit/core';
import { Rule } from '@angular-devkit/schematics';
import { Schema } from './schema';
export interface NormalizedSchema extends Schema {
    name: string;
    fileName: string;
    projectRoot: Path;
    routePath: string;
    projectDirectory: string;
    parsedTags: string[];
    appMain?: string;
    appSourceRoot?: Path;
}
export default function (schema: Schema): Rule;
