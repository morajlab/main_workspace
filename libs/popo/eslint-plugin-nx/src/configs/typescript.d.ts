declare const _default: {
    parser: string;
    parserOptions: {
        ecmaVersion: number;
        sourceType: string;
    };
    plugins: string[];
    extends: string[];
    rules: {
        '@typescript-eslint/explicit-member-accessibility': string;
        '@typescript-eslint/explicit-module-boundary-types': string;
        '@typescript-eslint/explicit-function-return-type': string;
        '@typescript-eslint/no-parameter-properties': string;
    };
    overrides: {
        files: string[];
        rules: {
            '@typescript-eslint/no-unused-vars': string;
        };
    }[];
};
/**
 * This configuration is intended to be applied to ALL .ts and .tsx files
 * within an Nx workspace.
 *
 * It should therefore NOT contain any rules or plugins which are specific
 * to one ecosystem, such as React, Angular, Node etc.
 *
 * NOTE: Currently the one exception to this is that there is an override for .tsx
 * for the @typescript-eslint/no-unused-vars rule for backwards compatibility
 * with the original root Nx ESlint config. This will be split out into a dedicated
 * tsx configuration in a follow up PR which handles overrides.
 */
export default _default;
