import { Rule } from '@angular-devkit/schematics';
export interface Schema {
    directory: string;
    name: string;
    appName: string;
    npmScope?: string;
    skipInstall?: boolean;
    skipGit?: boolean;
    style?: string;
    nxCloud?: boolean;
    preset: 'empty' | 'oss' | 'angular' | 'react' | 'web-components' | 'angular-nest' | 'react-express' | 'next' | 'nest';
    commit?: {
        name: string;
        email: string;
        message?: string;
    };
    defaultBase?: string;
    nxWorkspaceRoot?: string;
    linter: 'tslint' | 'eslint';
    packageManager?: string;
}
export declare function sharedNew(cli: string, options: Schema): Rule;
