import { Rule } from '@angular-devkit/schematics';
import { Schema } from '../schema';
/**
 * Check whether the project to be removed is depended on by another project
 *
 * Throws an error if the project is in use, unless the `--forceRemove` option is used.
 *
 * @param schema The options provided to the schematic
 */
export declare function checkDependencies(schema: Schema): Rule;
