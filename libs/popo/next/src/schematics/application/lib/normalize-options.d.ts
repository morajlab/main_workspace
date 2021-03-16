import { Path } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { Schema } from '../schema';
export interface NormalizedSchema extends Schema {
    projectName: string;
    appProjectRoot: Path;
    e2eProjectName: string;
    e2eProjectRoot: Path;
    parsedTags: string[];
    fileName: string;
    styledModule: null | string;
}
export declare function normalizeOptions(host: Tree, options: Schema): NormalizedSchema;
