import { Schema } from '../schema';
/**
 * Check whether the project to be removed has builders targetted by another project
 *
 * Throws an error if the project is in use, unless the `--forceRemove` option is used.
 *
 * @param schema The options provided to the schematic
 */
export declare function checkTargets(schema: Schema): import("@angular-devkit/schematics").Rule;
