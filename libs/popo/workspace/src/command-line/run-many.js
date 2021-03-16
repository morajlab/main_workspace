"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMany = void 0;
const tslib_1 = require("tslib");
const run_command_1 = require("../tasks-runner/run-command");
const utils_1 = require("./utils");
const project_graph_1 = require("../core/project-graph");
const file_utils_1 = require("../core/file-utils");
const default_reporter_1 = require("../tasks-runner/default-reporter");
const project_graph_utils_1 = require("../utils/project-graph-utils");
const output_1 = require("../utils/output");
const prompt_for_nx_cloud_1 = require("./prompt-for-nx-cloud");
function runMany(parsedArgs) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { nxArgs, overrides } = utils_1.splitArgsIntoNxArgsAndOverrides(parsedArgs, 'run-many');
        yield prompt_for_nx_cloud_1.promptForNxCloud(nxArgs.scan);
        const projectGraph = project_graph_1.createProjectGraph();
        const projects = projectsToRun(nxArgs, projectGraph);
        const projectMap = {};
        projects.forEach((proj) => {
            projectMap[proj.name] = proj;
        });
        const env = file_utils_1.readEnvironment(nxArgs.target, projectMap);
        const filteredProjects = Object.values(projects).filter((n) => !parsedArgs.onlyFailed || !env.workspaceResults.getResult(n.name));
        run_command_1.runCommand(filteredProjects, projectGraph, env, nxArgs, overrides, new default_reporter_1.DefaultReporter(), null);
    });
}
exports.runMany = runMany;
function projectsToRun(nxArgs, projectGraph) {
    const allProjects = Object.values(projectGraph.nodes);
    if (nxArgs.all) {
        return runnableForTarget(allProjects, nxArgs.target);
    }
    else {
        checkForInvalidProjects(nxArgs, allProjects);
        let selectedProjects = allProjects.filter((p) => nxArgs.projects.indexOf(p.name) > -1);
        if (nxArgs.withDeps) {
            selectedProjects = Object.values(project_graph_1.withDeps(projectGraph, selectedProjects).nodes);
        }
        return runnableForTarget(selectedProjects, nxArgs.target, true);
    }
}
function checkForInvalidProjects(nxArgs, allProjects) {
    const invalid = nxArgs.projects.filter((name) => !allProjects.find((p) => p.name === name));
    if (invalid.length !== 0) {
        throw new Error(`Invalid projects: ${invalid.join(', ')}`);
    }
}
function runnableForTarget(projects, target, strict = false) {
    const notRunnable = [];
    const runnable = [];
    for (let project of projects) {
        if (project_graph_utils_1.projectHasTarget(project, target)) {
            runnable.push(project);
        }
        else if (project_graph_1.isWorkspaceProject(project)) {
            notRunnable.push(project);
        }
    }
    if (strict && notRunnable.length) {
        output_1.output.warn({
            title: `the following do not have configuration for "${target}"`,
            bodyLines: notRunnable.map((p) => '- ' + p.name),
        });
    }
    return runnable;
}
//# sourceMappingURL=run-many.js.map