import { ESLint } from 'eslint';
import { Schema } from '../schema';
export declare function loadESLint(): Promise<any>;
export declare function lint(eslintConfigPath: string | undefined, options: Schema): Promise<ESLint.LintResult[]>;
