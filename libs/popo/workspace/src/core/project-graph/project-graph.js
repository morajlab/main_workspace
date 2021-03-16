"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectGraph = void 0;
const assert_workspace_validity_1 = require("../assert-workspace-validity");
const file_graph_1 = require("../file-graph");
const file_utils_1 = require("../file-utils");
const normalize_nx_json_1 = require("../normalize-nx-json");
const build_dependencies_1 = require("./build-dependencies");
const build_nodes_1 = require("./build-nodes");
const project_graph_builder_1 = require("./project-graph-builder");
const nx_deps_cache_1 = require("../nx-deps/nx-deps-cache");
const perf_hooks_1 = require("perf_hooks");
function createProjectGraph(workspaceJson = file_utils_1.readWorkspaceJson(), nxJson = file_utils_1.readNxJson(), workspaceFiles = file_utils_1.readWorkspaceFiles(), fileRead = file_utils_1.defaultFileRead, cache = nx_deps_cache_1.readCache(), shouldCache = true) {
    assert_workspace_validity_1.assertWorkspaceValidity(workspaceJson, nxJson);
    const normalizedNxJson = normalize_nx_json_1.normalizeNxJson(nxJson);
    const rootFiles = file_utils_1.rootWorkspaceFileData();
    const fileMap = file_graph_1.createFileMap(workspaceJson, workspaceFiles);
    if (cache && !file_utils_1.filesChanged(rootFiles, cache.rootFiles)) {
        const diff = nx_deps_cache_1.differentFromCache(fileMap, cache);
        if (diff.noDifference) {
            return diff.partiallyConstructedProjectGraph;
        }
        const ctx = {
            workspaceJson,
            nxJson: normalizedNxJson,
            fileMap: diff.filesDifferentFromCache,
        };
        const projectGraph = buildProjectGraph(ctx, fileRead, diff.partiallyConstructedProjectGraph);
        if (shouldCache) {
            nx_deps_cache_1.writeCache(rootFiles, projectGraph);
        }
        return projectGraph;
    }
    else {
        const ctx = {
            workspaceJson,
            nxJson: normalizedNxJson,
            fileMap: fileMap,
        };
        const projectGraph = buildProjectGraph(ctx, fileRead, null);
        if (shouldCache) {
            nx_deps_cache_1.writeCache(rootFiles, projectGraph);
        }
        return projectGraph;
    }
}
exports.createProjectGraph = createProjectGraph;
function buildProjectGraph(ctx, fileRead, projectGraph) {
    perf_hooks_1.performance.mark('build project graph:start');
    const builder = new project_graph_builder_1.ProjectGraphBuilder(projectGraph);
    const buildNodesFns = [
        build_nodes_1.buildWorkspaceProjectNodes,
        build_nodes_1.buildNpmPackageNodes,
    ];
    const buildDependenciesFns = [
        build_dependencies_1.buildExplicitTypeScriptDependencies,
        build_dependencies_1.buildImplicitProjectDependencies,
    ];
    buildNodesFns.forEach((f) => f(ctx, builder.addNode.bind(builder), fileRead));
    buildDependenciesFns.forEach((f) => f(ctx, builder.nodes, builder.addDependency.bind(builder), fileRead));
    const r = builder.build();
    perf_hooks_1.performance.mark('build project graph:end');
    perf_hooks_1.performance.measure('build project graph', 'build project graph:start', 'build project graph:end');
    return r;
}
//# sourceMappingURL=project-graph.js.map