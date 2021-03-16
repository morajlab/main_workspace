"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("./configs/typescript");
const javascript_1 = require("./configs/javascript");
const react_tmp_1 = require("./configs/react-tmp");
const react_base_1 = require("./configs/react-base");
const react_jsx_1 = require("./configs/react-jsx");
const react_typescript_1 = require("./configs/react-typescript");
const enforce_module_boundaries_1 = require("./rules/enforce-module-boundaries");
module.exports = {
    configs: {
        typescript: typescript_1.default,
        javascript: javascript_1.default,
        react: react_tmp_1.default,
        'react-base': react_base_1.default,
        'react-typescript': react_typescript_1.default,
        'react-jsx': react_jsx_1.default,
    },
    rules: {
        [enforce_module_boundaries_1.RULE_NAME]: enforce_module_boundaries_1.default,
    },
};
//# sourceMappingURL=index.js.map