"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
function update() {
    return (host) => {
        const decorateCli = fs_1.readFileSync(path_1.join(__dirname, '..', '..', 'schematics', 'utils', 'decorate-angular-cli.js__tmpl__')).toString();
        if (host.exists('/decorate-angular-cli.js')) {
            host.overwrite('/decorate-angular-cli.js', decorateCli);
        }
    };
}
exports.default = update;
//# sourceMappingURL=update-decorate-angular-cli.js.map