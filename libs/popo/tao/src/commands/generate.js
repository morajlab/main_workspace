"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = exports.taoNew = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const schematics_1 = require("@angular-devkit/schematics");
const tools_1 = require("@angular-devkit/schematics/tools");
const inquirer = require("inquirer");
const minimist = require("minimist");
const detect_package_manager_1 = require("../shared/detect-package-manager");
const logger_1 = require("../shared/logger");
const params_1 = require("../shared/params");
const print_help_1 = require("../shared/print-help");
function throwInvalidInvocation() {
    throw new Error(`Specify the schematic name (e.g., ${print_help_1.commandName} generate collection-name:schematic-name)`);
}
function parseGenerateOpts(args, mode, defaultCollection) {
    const schematicOptions = params_1.convertToCamelCase(minimist(args, {
        boolean: ['help', 'dryRun', 'debug', 'force', 'interactive'],
        alias: {
            dryRun: 'dry-run',
            d: 'dryRun',
        },
        default: {
            debug: false,
            dryRun: false,
            interactive: true,
        },
    }));
    let collectionName = null;
    let schematicName = null;
    if (mode === 'generate') {
        if (!schematicOptions['_'] ||
            schematicOptions['_'].length === 0) {
            throwInvalidInvocation();
        }
        [collectionName, schematicName] = schematicOptions['_']
            .shift()
            .split(':');
        if (!schematicName) {
            schematicName = collectionName;
            collectionName = defaultCollection;
        }
    }
    else {
        collectionName = schematicOptions.collection;
        schematicName = '';
    }
    if (!collectionName) {
        throwInvalidInvocation();
    }
    const res = {
        collectionName,
        schematicName,
        schematicOptions,
        help: schematicOptions.help,
        debug: schematicOptions.debug,
        dryRun: schematicOptions.dryRun,
        force: schematicOptions.force,
        interactive: schematicOptions.interactive,
        defaults: schematicOptions.defaults,
    };
    delete schematicOptions.debug;
    delete schematicOptions.d;
    delete schematicOptions.dryRun;
    delete schematicOptions.force;
    delete schematicOptions.interactive;
    delete schematicOptions.defaults;
    delete schematicOptions.help;
    delete schematicOptions['--'];
    return res;
}
function normalizeOptions(opts, schema) {
    return params_1.lookupUnmatched(params_1.convertAliases(params_1.coerceTypes(opts, schema), schema, true), schema);
}
function createRecorder(record, logger) {
    return (event) => {
        const eventPath = event.path.startsWith('/')
            ? event.path.substr(1)
            : event.path;
        if (event.kind === 'error') {
            record.error = true;
            logger.warn(`ERROR! ${eventPath} ${event.description == 'alreadyExist'
                ? 'already exists'
                : 'does not exist.'}.`);
        }
        else if (event.kind === 'update') {
            record.loggingQueue.push(core_1.tags.oneLine `${core_1.terminal.white('UPDATE')} ${eventPath} (${event.content.length} bytes)`);
        }
        else if (event.kind === 'create') {
            record.loggingQueue.push(core_1.tags.oneLine `${core_1.terminal.green('CREATE')} ${eventPath} (${event.content.length} bytes)`);
        }
        else if (event.kind === 'delete') {
            record.loggingQueue.push(`${core_1.terminal.yellow('DELETE')} ${eventPath}`);
        }
        else if (event.kind === 'rename') {
            record.loggingQueue.push(`${core_1.terminal.blue('RENAME')} ${eventPath} => ${event.to}`);
        }
    };
}
function isTTY() {
    return !!process.stdout.isTTY && process.env['CI'] !== 'true';
}
function createWorkflow(fsHost, root, opts) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const workflow = new tools_1.NodeWorkflow(fsHost, {
            force: opts.force,
            dryRun: opts.dryRun,
            packageManager: detect_package_manager_1.detectPackageManager(),
            root: core_1.normalize(root),
            registry: new core_1.schema.CoreSchemaRegistry(schematics_1.formats.standardFormats),
            resolvePaths: [process.cwd(), root],
        });
        const _params = opts.schematicOptions._;
        delete opts.schematicOptions._;
        workflow.registry.addSmartDefaultProvider('argv', (schema) => {
            if ('index' in schema) {
                return _params[Number(schema['index'])];
            }
            else {
                return _params;
            }
        });
        if (opts.defaults) {
            workflow.registry.addPreTransform(core_1.schema.transforms.addUndefinedDefaults);
        }
        else {
            workflow.registry.addPostTransform(core_1.schema.transforms.addUndefinedDefaults);
        }
        workflow.engineHost.registerOptionsTransform(tools_1.validateOptionsWithSchema(workflow.registry));
        if (opts.interactive !== false && isTTY()) {
            workflow.registry.usePromptProvider((definitions) => {
                const questions = definitions.map((definition) => {
                    const question = {
                        name: definition.id,
                        message: definition.message,
                        default: definition.default,
                    };
                    const validator = definition.validator;
                    if (validator) {
                        question.validate = (input) => validator(input);
                    }
                    switch (definition.type) {
                        case 'confirmation':
                            question.type = 'confirm';
                            break;
                        case 'list':
                            question.type = definition.multiselect ? 'checkbox' : 'list';
                            question.choices =
                                definition.items &&
                                    definition.items.map((item) => {
                                        if (typeof item == 'string') {
                                            return item;
                                        }
                                        else {
                                            return {
                                                name: item.label,
                                                value: item.value,
                                            };
                                        }
                                    });
                            break;
                        default:
                            question.type = definition.type;
                            break;
                    }
                    return question;
                });
                return inquirer.prompt(questions);
            });
        }
        return workflow;
    });
}
function getCollection(workflow, name) {
    const collection = workflow.engine.createCollection(name);
    if (!collection)
        throw new Error(`Cannot find collection '${name}'`);
    return collection;
}
function printGenHelp(opts, schema, logger) {
    print_help_1.printHelp(`${print_help_1.commandName} generate ${opts.collectionName}:${opts.schematicName}`, Object.assign(Object.assign({}, schema), { properties: Object.assign(Object.assign({}, schema.properties), { dryRun: {
                type: 'boolean',
                default: false,
                description: `Runs through and reports activity without writing to disk.`,
            } }) }), logger);
}
function getSchematicDefaults(root, collection, schematic) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const workspace = yield new core_1.experimental.workspace.Workspace(core_1.normalize(root), new node_1.NodeJsSyncHost())
            .loadWorkspaceFromHost('workspace.json')
            .toPromise();
        let result = {};
        if (workspace.getSchematics()) {
            const schematicObject = workspace.getSchematics()[`${collection}:${schematic}`];
            if (schematicObject) {
                result = Object.assign(Object.assign({}, result), schematicObject);
            }
            const collectionObject = workspace.getSchematics()[collection];
            if (typeof collectionObject == 'object' &&
                !Array.isArray(collectionObject)) {
                result = Object.assign(Object.assign({}, result), collectionObject[schematic]);
            }
        }
        return result;
    });
}
function runSchematic(root, workflow, logger, opts, schematic, allowAdditionalArgs = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const flattenedSchema = (yield workflow.registry
            .flatten(schematic.description.schemaJson)
            .toPromise());
        if (opts.help) {
            printGenHelp(opts, flattenedSchema, logger);
            return 0;
        }
        const defaults = opts.schematicName === 'tao-new' || opts.schematicName === 'ng-new'
            ? {}
            : yield getSchematicDefaults(root, opts.collectionName, opts.schematicName);
        const record = { loggingQueue: [], error: false };
        workflow.reporter.subscribe(createRecorder(record, logger));
        const schematicOptions = normalizeOptions(opts.schematicOptions, flattenedSchema);
        if (schematicOptions['--'] && !allowAdditionalArgs) {
            schematicOptions['--'].forEach((unmatched) => {
                const message = `Could not match option '${unmatched.name}' to the ${opts.collectionName}:${opts.schematicName} schema.` +
                    (unmatched.possible.length > 0
                        ? ` Possible matches : ${unmatched.possible.join()}`
                        : '');
                logger.fatal(message);
            });
            return 1;
        }
        yield workflow
            .execute({
            collection: opts.collectionName,
            schematic: opts.schematicName,
            options: Object.assign(Object.assign({}, defaults), schematicOptions),
            debug: opts.debug,
            logger,
        })
            .toPromise();
        if (!record.error) {
            record.loggingQueue.forEach((log) => logger.info(log));
        }
        if (opts.dryRun) {
            logger.warn(`\nNOTE: The "dryRun" flag means no changes were made.`);
        }
        return 0;
    });
}
function readDefaultCollection(host) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const workspaceJson = JSON.parse(new schematics_1.HostTree(host).read('workspace.json').toString());
        return workspaceJson.cli ? workspaceJson.cli.defaultCollection : null;
    });
}
function taoNew(root, args, isVerbose = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const logger = logger_1.getLogger(isVerbose);
        return params_1.handleErrors(logger, isVerbose, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fsHost = new core_1.virtualFs.ScopedHost(new node_1.NodeJsSyncHost(), core_1.normalize(root));
            const opts = parseGenerateOpts(args, 'new', null);
            const workflow = yield createWorkflow(fsHost, root, opts);
            const collection = getCollection(workflow, opts.collectionName);
            const schematic = collection.createSchematic(opts.schematicOptions.cli === 'ng' ? 'ng-new' : 'tao-new', true);
            const allowAdditionalArgs = true; // we can't yet know the schema to validate against
            return runSchematic(root, workflow, logger, Object.assign(Object.assign({}, opts), { schematicName: schematic.description.name }), schematic, allowAdditionalArgs);
        }));
    });
}
exports.taoNew = taoNew;
function generate(root, args, isVerbose = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const logger = logger_1.getLogger(isVerbose);
        return params_1.handleErrors(logger, isVerbose, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fsHost = new core_1.virtualFs.ScopedHost(new node_1.NodeJsSyncHost(), core_1.normalize(root));
            const opts = parseGenerateOpts(args, 'generate', yield readDefaultCollection(fsHost));
            const workflow = yield createWorkflow(fsHost, root, opts);
            const collection = getCollection(workflow, opts.collectionName);
            const schematic = collection.createSchematic(opts.schematicName, true);
            return runSchematic(root, workflow, logger, Object.assign(Object.assign({}, opts), { schematicName: schematic.description.name }), schematic);
        }));
    });
}
exports.generate = generate;
//# sourceMappingURL=generate.js.map