"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const lint_1 = require("../../utils/lint");
const init_1 = require("../init/init");
const create_application_files_1 = require("./lib/create-application-files");
const update_jest_config_1 = require("./lib/update-jest-config");
const normalize_options_1 = require("./lib/normalize-options");
const add_project_1 = require("./lib/add-project");
const add_cypress_1 = require("./lib/add-cypress");
const add_jest_1 = require("./lib/add-jest");
const add_routing_1 = require("./lib/add-routing");
const set_defaults_1 = require("./lib/set-defaults");
const update_nx_json_1 = require("./lib/update-nx-json");
const add_styled_dependencies_1 = require("../../rules/add-styled-dependencies");
function default_1(schema) {
    return (host, context) => {
        const options = normalize_options_1.normalizeOptions(host, schema);
        return schematics_1.chain([
            init_1.default(Object.assign(Object.assign({}, options), { skipFormat: true })),
            workspace_1.addLintFiles(options.appProjectRoot, options.linter, {
                localConfig: lint_1.reactEslintJson,
                extraPackageDeps: lint_1.extraEslintDependencies,
            }),
            create_application_files_1.createApplicationFiles(options),
            update_nx_json_1.updateNxJson(options),
            add_project_1.addProject(options),
            add_cypress_1.addCypress(options),
            add_jest_1.addJest(options),
            update_jest_config_1.updateJestConfig(options),
            add_styled_dependencies_1.addStyledModuleDependencies(options.styledModule),
            add_routing_1.addRouting(options, context),
            set_defaults_1.setDefaults(options),
            workspace_1.formatFiles(options),
        ]);
    };
}
exports.default = default_1;
//# sourceMappingURL=application.js.map