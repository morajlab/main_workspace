"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPackageJson = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path_1 = require("path");
const workspace_1 = require("@nrwl/workspace");
function createPackageJson(options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const rootPackageJson = workspace_1.readJsonFile(path_1.join(context.workspaceRoot, 'package.json'));
        const outPackageJson = {
            name: context.target.project,
            version: '0.0.1',
            scripts: {
                start: 'next start',
            },
            dependencies: rootPackageJson.dependencies,
        };
        fs_1.writeFileSync(path_1.join(options.outputPath, 'package.json'), JSON.stringify(outPackageJson, null, 2));
    });
}
exports.createPackageJson = createPackageJson;
//# sourceMappingURL=create-package-json.js.map