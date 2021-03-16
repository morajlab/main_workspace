import { Rule } from '@angular-devkit/schematics';
export declare const NEXT_SPECIFIC_STYLE_DEPENDENCIES: {
    'styled-components': {
        dependencies: import("../../../../build/packages/react/src/utils/dependencies").DependencyEntries;
        devDependencies: {
            'babel-plugin-styled-components': string;
        };
    };
    '@emotion/styled': {
        dependencies: {
            'emotion-server': string;
        };
        devDependencies: import("../../../../build/packages/react/src/utils/dependencies").DependencyEntries;
    };
    css: {
        dependencies: {};
        devDependencies: {};
    };
    scss: {
        dependencies: {};
        devDependencies: {
            'node-sass': string;
        };
    };
    less: {
        dependencies: {
            '@zeit/next-less': string;
        };
        devDependencies: {};
    };
    styl: {
        dependencies: {
            '@zeit/next-stylus': string;
        };
        devDependencies: {};
    };
};
export declare function addStyleDependencies(style: string): Rule;
