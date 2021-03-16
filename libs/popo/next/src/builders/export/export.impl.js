"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const architect_1 = require("@angular-devkit/architect");
const export_1 = require("next/dist/export");
const constants_1 = require("next/dist/next-server/lib/constants");
const path = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const config_1 = require("../../utils/config");
try {
    require('dotenv').config();
}
catch (e) { }
exports.default = architect_1.createBuilder(run);
function run(options, context) {
    const buildTarget = architect_1.targetFromTargetString(options.buildTarget);
    const build$ = architect_1.scheduleTargetAndForget(context, buildTarget);
    return build$.pipe(operators_1.concatMap((r) => {
        if (!r.success)
            return rxjs_1.of(r);
        return rxjs_1.from(context.getTargetOptions(buildTarget)).pipe(operators_1.concatMap((buildOptions) => {
            const root = path.resolve(context.workspaceRoot, buildOptions.root);
            const config = config_1.prepareConfig(constants_1.PHASE_EXPORT, buildOptions, context);
            return rxjs_1.from(export_1.default(root, {
                statusMessage: 'Exporting',
                silent: options.silent,
                threads: options.threads,
                outdir: `${buildOptions.outputPath}/exported`,
            }, config)).pipe(operators_1.map(() => ({ success: true })));
        }));
    }));
}
//# sourceMappingURL=export.impl.js.map