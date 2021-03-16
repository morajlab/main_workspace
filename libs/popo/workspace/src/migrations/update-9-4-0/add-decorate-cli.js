"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const format_files_1 = require("../../utils/rules/format-files");
const fs_1 = require("fs");
const workspace_1 = require("@nrwl/workspace");
const path_1 = require("path");
const decorateAngularClI = (host, context) => {
    if (host.exists('angular.json')) {
        const decorateCli = fs_1.readFileSync(path_1.join(__dirname, '..', '..', 'schematics', 'utils', 'decorate-angular-cli.js__tmpl__')).toString();
        host.create('decorate-angular-cli.js', decorateCli);
        workspace_1.updateJsonInTree('package.json', (json) => {
            if (json.scripts &&
                json.scripts.postinstall &&
                !json.scripts.postinstall.includes('decorate-angular-cli.js')) {
                // if exists, add execution of this script
                json.scripts.postinstall += ' && node ./decorate-angular-cli.js';
            }
            else {
                if (!json.scripts)
                    json.scripts = {};
                // if doesn't exist, set to execute this script
                json.scripts.postinstall = 'node ./decorate-angular-cli.js';
            }
            if (json.scripts.ng) {
                json.scripts.ng = 'nx';
            }
            return json;
        })(host, context);
    }
};
function default_1() {
    return schematics_1.chain([decorateAngularClI, format_files_1.formatFiles()]);
}
exports.default = default_1;
//# sourceMappingURL=add-decorate-cli.js.map