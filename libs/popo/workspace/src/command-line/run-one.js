"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOne = void 0;
const tslib_1 = require("tslib");
const run_command_1 = require("../tasks-runner/run-command");
const project_graph_1 = require("../core/project-graph");
const file_utils_1 = require("../core/file-utils");
const empty_reporter_1 = require("../tasks-runner/empty-reporter");
const utils_1 = require("./utils");
const project_graph_utils_1 = require("../utils/project-graph-utils");
const prompt_for_nx_cloud_1 = require("./prompt-for-nx-cloud");
function runOne(opts) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { nxArgs, overrides } = utils_1.splitArgsIntoNxArgsAndOverrides(Object.assign(Object.assign({}, opts.parsedArgs), { configuration: opts.configuration, target: opts.target }), 'run-one');
        yield prompt_for_nx_cloud_1.promptForNxCloud(nxArgs.scan);
        const projectGraph = project_graph_1.createProjectGraph();
        const { projects, projectsMap } = getProjects(projectGraph, nxArgs.withDeps, opts.project, opts.target);
        const env = file_utils_1.readEnvironment(opts.target, projectsMap);
        const reporter = nxArgs.withDeps
            ? new (require(`../tasks-runner/run-one-reporter`).RunOneReporter)(opts.project)
            : new empty_reporter_1.EmptyReporter();
        run_command_1.runCommand(projects, projectGraph, env, nxArgs, overrides, reporter, opts.project);
    });
}
exports.runOne = runOne;
function getProjects(projectGraph, includeDeps, project, target) {
    let projects = [projectGraph.nodes[project]];
    let projectsMap = {
        [project]: projectGraph.nodes[project],
    };
    if (includeDeps) {
        const s = require(`../core/project-graph`);
        const deps = s.onlyWorkspaceProjects(s.withDeps(projectGraph, projects))
            .nodes;
        const projectsWithTarget = Object.values(deps).filter((p) => project_graph_utils_1.projectHasTarget(p, target));
        return {
            projects: projectsWithTarget,
            projectsMap: deps,
        };
    }
    else {
        return { projects, projectsMap };
    }
}
//# sourceMappingURL=run-one.js.map