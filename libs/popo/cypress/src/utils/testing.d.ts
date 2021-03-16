import { Tree, Rule } from '@angular-devkit/schematics';
export declare function runSchematic(schematicName: string, options: any, tree: Tree): Promise<import("@angular-devkit/schematics/testing").UnitTestTree>;
export declare function callRule(rule: Rule, tree: Tree): Promise<import("@angular-devkit/schematics/src/tree/interface").Tree>;
export declare function runMigration(migrationName: string, options: any, tree: Tree): Promise<import("@angular-devkit/schematics/testing").UnitTestTree>;
