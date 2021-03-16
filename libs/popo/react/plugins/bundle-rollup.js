"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRollupOptions(options) {
    const extraGlobals = {
        react: 'React',
        'react-dom': 'ReactDOM',
        'styled-components': 'styled',
        '@emotion/core': 'emotionCore',
        '@emotion/styled': 'emotionStyled',
    };
    if (Array.isArray(options.output)) {
        options.output.forEach((o) => {
            o.globals = Object.assign(Object.assign({}, o.globals), extraGlobals);
        });
    }
    else {
        options.output = Object.assign(Object.assign({}, options.output), extraGlobals);
    }
    return options;
}
module.exports = getRollupOptions;
//# sourceMappingURL=bundle-rollup.js.map