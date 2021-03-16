"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const architect_1 = require("@angular-devkit/architect");
const build_1 = require("next/dist/build");
const constants_1 = require("next/dist/next-server/lib/constants");
const path = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const config_1 = require("../../utils/config");
const create_package_json_1 = require("./lib/create-package-json");
try {
    require('dotenv').config();
}
catch (e) { }
exports.default = architect_1.createBuilder(run);
function run(options, context) {
    const root = path.resolve(context.workspaceRoot, options.root);
    const config = config_1.prepareConfig(constants_1.PHASE_PRODUCTION_BUILD, options, context);
    return rxjs_1.from(build_1.default(root, config)).pipe(operators_1.concatMap(() => rxjs_1.from(create_package_json_1.createPackageJson(options, context))), operators_1.map(() => ({ success: true })));
}
exports.run = run;
//# sourceMappingURL=build.impl.js.map