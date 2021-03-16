import { Rule } from '@angular-devkit/schematics';
export interface StorybookStoriesSchema {
    project: string;
    generateCypressSpecs: boolean;
    js?: boolean;
}
export declare function createAllStories(projectName: string, generateCypressSpecs: boolean, js: any): Rule;
export default function (schema: StorybookStoriesSchema): Rule;
