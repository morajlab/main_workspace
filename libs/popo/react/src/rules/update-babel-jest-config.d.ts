import { Tree } from '@angular-devkit/schematics';
declare type BabelJestConfigUpdater<T> = (json: T) => T;
export declare function updateBabelJestConfig<T = any>(projectRoot: string, update: BabelJestConfigUpdater<T>): (host: Tree) => import("@angular-devkit/schematics").Rule;
export {};
