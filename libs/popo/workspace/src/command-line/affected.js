"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.affected = void 0;
const tslib_1 = require("tslib");
const dep_graph_1 = require("./dep-graph");
const output_1 = require("../utils/output");
const shared_1 = require("./shared");
const run_command_1 = require("../tasks-runner/run-command");
const utils_1 = require("./utils");
const affected_project_graph_1 = require("../core/affected-project-graph");
const project_graph_1 = require("../core/project-graph");
const file_utils_1 = require("../core/file-utils");
const print_affected_1 = require("./print-affected");
const project_graph_utils_1 = require("../utils/project-graph-utils");
const default_reporter_1 = require("../tasks-runner/default-reporter");
const prompt_for_nx_cloud_1 = require("./prompt-for-nx-cloud");
function affected(command, parsedArgs) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { nxArgs, overrides } = utils_1.splitArgsIntoNxArgsAndOverrides(parsedArgs, 'affected', {
            printWarnings: command !== 'print-affected' && !parsedArgs.plain,
        });
        yield prompt_for_nx_cloud_1.promptForNxCloud(nxArgs.scan);
        const projectGraph = project_graph_1.createProjectGraph();
        let affectedGraph = nxArgs.all
            ? projectGraph
            : affected_project_graph_1.filterAffected(projectGraph, file_utils_1.calculateFileChanges(shared_1.parseFiles(nxArgs).files, nxArgs));
        if (parsedArgs.withDeps) {
            affectedGraph = project_graph_1.onlyWorkspaceProjects(project_graph_1.withDeps(projectGraph, Object.values(affectedGraph.nodes)));
        }
        const projects = parsedArgs.all ? projectGraph.nodes : affectedGraph.nodes;
        const env = file_utils_1.readEnvironment(nxArgs.target, projects);
        const affectedProjects = Object.values(projects)
            .filter((n) => !parsedArgs.exclude.includes(n.name))
            .filter((n) => !parsedArgs.onlyFailed || !env.workspaceResults.getResult(n.name));
        try {
            switch (command) {
                case 'apps':
                    const apps = affectedProjects
                        .filter((p) => p.type === project_graph_1.ProjectType.app)
                        .map((p) => p.name);
                    if (parsedArgs.plain) {
                        console.log(apps.join(' '));
                    }
                    else {
                        if (apps.length) {
                            output_1.output.log({
                                title: 'Affected apps:',
                                bodyLines: apps.map((app) => `${output_1.output.colors.gray('-')} ${app}`),
                            });
                        }
                    }
                    break;
                case 'libs':
                    const libs = affectedProjects
                        .filter((p) => p.type === project_graph_1.ProjectType.lib)
                        .map((p) => p.name);
                    if (parsedArgs.plain) {
                        console.log(libs.join(' '));
                    }
                    else {
                        if (libs.length) {
                            output_1.output.log({
                                title: 'Affected libs:',
                                bodyLines: libs.map((lib) => `${output_1.output.colors.gray('-')} ${lib}`),
                            });
                        }
                    }
                    break;
                case 'dep-graph':
                    const projectNames = affectedProjects.map((p) => p.name);
                    dep_graph_1.generateGraph(parsedArgs, projectNames);
                    break;
                case 'print-affected':
                    if (nxArgs.target) {
                        const projectsWithTarget = allProjectsWithTarget(affectedProjects, nxArgs);
                        print_affected_1.printAffected(projectsWithTarget, affectedProjects, projectGraph, nxArgs, overrides);
                    }
                    else {
                        print_affected_1.printAffected([], affectedProjects, projectGraph, nxArgs, overrides);
                    }
                    break;
                case 'affected': {
                    const projectsWithTarget = allProjectsWithTarget(affectedProjects, nxArgs);
                    run_command_1.runCommand(projectsWithTarget, projectGraph, env, nxArgs, overrides, new default_reporter_1.DefaultReporter(), null);
                    break;
                }
            }
        }
        catch (e) {
            printError(e, parsedArgs.verbose);
            process.exit(1);
        }
    });
}
exports.affected = affected;
function allProjectsWithTarget(projects, nxArgs) {
    return projects.filter((p) => project_graph_utils_1.projectHasTarget(p, nxArgs.target));
}
function printError(e, verbose) {
    const bodyLines = [e.message];
    if (verbose && e.stack) {
        bodyLines.push('');
        bodyLines.push(e.stack);
    }
    output_1.output.error({
        title: 'There was a critical error when running your command',
        bodyLines,
    });
}
//# sourceMappingURL=affected.js.map