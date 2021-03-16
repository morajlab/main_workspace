"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const update_packages_in_package_json_1 = require("../../utils/update-packages-in-package-json");
const path_1 = require("path");
const format_files_1 = require("../../utils/rules/format-files");
const updatePackages = update_packages_in_package_json_1.updatePackagesInPackageJson(path_1.join(__dirname, '../../..', 'migrations.json'), '10.3.0');
function default_1() {
    return schematics_1.chain([updatePackages, format_files_1.formatFiles()]);
}
exports.default = default_1;
//# sourceMappingURL=update-typescript.js.map