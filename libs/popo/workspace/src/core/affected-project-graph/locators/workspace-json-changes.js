"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTouchedProjectsInWorkspaceJson = void 0;
const file_utils_1 = require("../../file-utils");
const json_diff_1 = require("../../../utils/json-diff");
exports.getTouchedProjectsInWorkspaceJson = (touchedFiles, workspaceJson) => {
    const workspaceChange = touchedFiles.find((change) => change.file === file_utils_1.workspaceFileName());
    if (!workspaceChange) {
        return [];
    }
    const changes = workspaceChange.getChanges();
    if (changes.some((change) => {
        if (json_diff_1.isJsonChange(change)) {
            return change.path[0] !== 'projects';
        }
        if (file_utils_1.isWholeFileChange(change)) {
            return true;
        }
        return false;
    })) {
        return Object.keys(workspaceJson.projects);
    }
    const touched = [];
    for (let i = 0; i < changes.length; i++) {
        const change = changes[i];
        if (!json_diff_1.isJsonChange(change) || change.path[0] !== 'projects') {
            continue;
        }
        // Only look for changes that are changes to the whole project definition
        if (change.path.length !== 2) {
            continue;
        }
        switch (change.type) {
            case json_diff_1.DiffType.Deleted: {
                // We are not sure which projects used to depend on a deleted project
                // so return all projects to be safe
                return Object.keys(workspaceJson.projects);
            }
            default: {
                // Add the project name
                touched.push(change.path[1]);
            }
        }
    }
    return touched;
};
//# sourceMappingURL=workspace-json-changes.js.map