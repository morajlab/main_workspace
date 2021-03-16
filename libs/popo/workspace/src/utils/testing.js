"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockContext = exports.getTestArchitect = exports.createLibWithTests = exports.runMigration = exports.callRule = exports.runSchematic = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const testing_1 = require("@angular-devkit/schematics/testing");
const name_utils_1 = require("./name-utils");
const workspace_1 = require("./workspace");
const testing_2 = require("@angular-devkit/architect/testing");
const core_1 = require("@angular-devkit/core");
const architect_1 = require("@angular-devkit/architect");
const testing_3 = require("@nrwl/workspace/testing");
const testRunner = new testing_1.SchematicTestRunner('@nrwl/workspace', path_1.join(__dirname, '../../collection.json'));
testRunner.registerCollection('@nrwl/jest', path_1.join(__dirname, '../../../jest/collection.json'));
testRunner.registerCollection('@nrwl/cypress', path_1.join(__dirname, '../../../cypress/collection.json'));
testRunner.registerCollection('@nrwl/express', path_1.join(__dirname, '../../../express/collection.json'));
testRunner.registerCollection('@nrwl/react', path_1.join(__dirname, '../../../react/collection.json'));
testRunner.registerCollection('@nrwl/angular', path_1.join(__dirname, '../../../angular/collection.json'));
testRunner.registerCollection('@nrwl/next', path_1.join(__dirname, '../../../next/collection.json'));
testRunner.registerCollection('@nrwl/nest', path_1.join(__dirname, '../../../nest/collection.json'));
testRunner.registerCollection('@nrwl/web', path_1.join(__dirname, '../../../web/collection.json'));
const migrationTestRunner = new testing_1.SchematicTestRunner('@nrwl/workspace/migrations', path_1.join(__dirname, '../../migrations.json'));
function runSchematic(schematicName, options, tree) {
    return testRunner.runSchematicAsync(schematicName, options, tree).toPromise();
}
exports.runSchematic = runSchematic;
function callRule(rule, tree) {
    return testRunner.callRule(rule, tree).toPromise();
}
exports.callRule = callRule;
function runMigration(migrationName, options, tree) {
    return migrationTestRunner
        .runSchematicAsync(migrationName, options, tree)
        .toPromise();
}
exports.runMigration = runMigration;
function createLibWithTests(tree, libName, testBuilder, testSetupFile) {
    const { fileName } = name_utils_1.names(libName);
    tree.create(`/libs/${fileName}/src/index.ts`, `\n`);
    return callRule(workspace_1.updateWorkspace((workspace) => {
        workspace.projects.add({
            name: fileName,
            root: `libs/${fileName}`,
            projectType: 'library',
            sourceRoot: `libs/${fileName}/src`,
            architect: {
                test: {
                    builder: testBuilder,
                    options: {
                        setupFile: `libs/${fileName}/src/${testSetupFile}`,
                    },
                },
            },
        });
    }), tree);
}
exports.createLibWithTests = createLibWithTests;
function getTestArchitect() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const architectHost = new testing_2.TestingArchitectHost('/root', '/root');
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