"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceRoot = void 0;
const tslib_1 = require("tslib");
function getSourceRoot(context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const projectMeta = yield context.getProjectMetadata(context.target.project);
        if (projectMeta.sourceRoot) {
            return projectMeta.sourceRoot;
        }
        else {
            context.reportStatus('Error');
            const message = `${context.target.project} does not have a sourceRoot. Please define one.`;
            context.logger.error(message);
            throw new Error(message);
        }
    });
}
exports.getSourceRoot = getSourceRoot;
//# sourceMappingURL=source-root.js.map