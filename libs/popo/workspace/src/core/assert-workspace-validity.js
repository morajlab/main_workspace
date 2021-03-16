"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertWorkspaceValidity = void 0;
const file_utils_1 = require("./file-utils");
const output_1 = require("../utils/output");
function assertWorkspaceValidity(workspaceJson, nxJson) {
    const workspaceJsonProjects = Object.keys(workspaceJson.projects);
    const nxJsonProjects = Object.keys(nxJson.projects);
    if (minus(workspaceJsonProjects, nxJsonProjects).length > 0) {
        output_1.output.error({
            title: 'Configuration Error',
            bodyLines: [
                `${file_utils_1.workspaceFileName()} and nx.json are out of sync. The following projects are missing in nx.json: ${minus(workspaceJsonProjects, nxJsonProjects).join(', ')}`,
            ],
        });
        process.exit(1);
    }
    if (minus(nxJsonProjects, workspaceJsonProjects).length > 0) {
        output_1.output.error({
            title: 'Configuration Error',
            bodyLines: [
                `${file_utils_1.workspaceFileName()} and nx.json are out of sync. The following projects are missing in ${file_utils_1.workspaceFileName()}: ${minus(nxJsonProjects, workspaceJsonProjects).join(', ')}`,
            ],
        });
        process.exit(1);
    }
    const projects = Object.assign(Object.assign({}, workspaceJson.projects), nxJson.projects);
    const invalidImplicitDependencies = new Map();
    Object.entries(nxJson.implicitDependencies || {})
        .reduce((acc, entry) => {
        function recur(value, acc = []) {
            if (value === '*') {
                // do nothing since '*' is calculated and always valid.
            }
            else if (Array.isArray(value)) {
                acc.push([entry[0], value]);
            }
            else {
                Object.values(value).forEach((v) => {
                    recur(v, acc);
                });
            }
        }
        recur(entry[1], acc);
        return acc;
    }, [])
        .reduce((map, [filename, projectNames]) => {
        detectAndSetInvalidProjectValues(map, filename, projectNames, projects);
        return map;
    }, invalidImplicitDependencies);
    nxJsonProjects
        .filter((nxJsonProjectName) => {
        const project = nxJson.projects[nxJsonProjectName];
        return !!project.implicitDependencies;
    })
        .reduce((map, nxJsonProjectName) => {
        const project = nxJson.projects[nxJsonProjectName];
        detectAndSetInvalidProjectValues(map, nxJsonProjectName, project.implicitDependencies, projects);
        return map;
    }, invalidImplicitDependencies);
    if (invalidImplicitDependencies.size === 0) {
        return;
    }
    let message = `The following implicitDependencies specified in nx.json are invalid:
  `;
    invalidImplicitDependencies.forEach((projectNames, key) => {
        const str = `  ${key}
    ${projectNames.map((projectName) => `    ${projectName}`).join('\n')}`;
        message += str;
    });
    output_1.output.error({
        title: 'Configuration Error',
        bodyLines: [message],
    });
    process.exit(1);
}
exports.assertWorkspaceValidity = assertWorkspaceValidity;
function detectAndSetInvalidProjectValues(map, sourceName, desiredProjectNames, validProjects) {
    const invalidProjects = desiredProjectNames.filter((projectName) => !validProjects[projectName]);
    if (invalidProjects.length > 0) {
        map.set(sourceName, invalidProjects);
    }
}
function minus(a, b) {
    const res = [];
    a.forEach((aa) => {
        if (!b.find((bb) => bb === aa)) {
            res.push(aa);
        }
    });
    return res;
}
//# sourceMappingURL=assert-workspace-validity.js.map