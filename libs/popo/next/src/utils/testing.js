"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockContext = exports.getTestArchitect = exports.createApp = exports.callRule = exports.runSchematic = void 0;
const tslib_1 = require("tslib");
const architect_1 = require("@angular-devkit/architect");
const testing_1 = require("@angular-devkit/architect/testing");
const core_1 = require("@angular-devkit/core");
const testing_2 = require("@angular-devkit/schematics/testing");
const name_utils_1 = require("@nrwl/workspace/src/utils/name-utils");
const workspace_1 = require("@nrwl/workspace/src/utils/workspace");
const testing_3 = require("@nrwl/workspace/testing");
const path_1 = require("path");
const testRunner = new testing_2.SchematicTestRunner('@nrwl/next', path_1.join(__dirname, '../../collection.json'));
testRunner.registerCollection('@nrwl/jest', path_1.join(__dirname, '../../../jest/collection.json'));
testRunner.registerCollection('@nrwl/cypress', path_1.join(__dirname, '../../../cypress/collection.json'));
testRunner.registerCollection('@nrwl/react', path_1.join(__dirname, '../../../react/collection.json'));
function runSchematic(schematicName, options, tree) {
    return testRunner.runSchematicAsync(schematicName, options, tree).toPromise();
}
exports.runSchematic = runSchematic;
function callRule(rule, tree) {
    return testRunner.callRule(rule, tree).toPromise();
}
exports.callRule = callRule;
function createApp(tree, appName) {
    const { fileName } = name_utils_1.names(appName);
    return callRule(workspace_1.updateWorkspace((workspace) => {
        workspace.projects.add({
            name: fileName,
            root: `apps/${fileName}`,
            projectType: 'application',
            sourceRoot: `apps/${fileName}/src`,
            targets: {},
        });
    }), tree);
}
exports.createApp = createApp;
function getTestArchitect() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const architectHost = new testing_1.TestingArchitectHost('/root', '/root');
        const registry = new core_1.schema.CoreSchemaRegistry();
        registry.addPostTransform(core_1.schema.transforms.addUndefinedDefaults);
        const architect = new architect_1.Architect(architectHost, registry);
        yield architectHost.addBuilderFromPackage(path_1.join(__dirname, '../..'));
        return [architect, architectHost];
    });
}
exports.getTestArchitect = getTestArchitect;
function getMockContext() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const [architect, architectHost] = yield getTestArchitect();
        const context = new testing_3.MockBuilderContext(architect, architectHost);
        yield context.addBuilderFromPackage(path_1.join(__dirname, '../..'));
        return context;
    });
}
exports.getMockContext = getMockContext;
//# sourceMappingURL=testing.js.map