#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeCli = exports.invokeCommand = void 0;
const tslib_1 = require("tslib");
const argv = require('yargs-parser')(process.argv.slice(2));
require("./src/compat/compat");
function invokeCommand(command, root, commandArgs = []) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (command === undefined) {
            command = 'help';
        }
        let verboseFlagIndex = commandArgs.indexOf('--verbose');
        if (verboseFlagIndex < 0) {
            verboseFlagIndex = commandArgs.indexOf('-v');
        }
        const isVerbose = verboseFlagIndex >= 0;
        if (isVerbose) {
            commandArgs.splice(verboseFlagIndex, 1);
        }
        switch (command) {
            case 'new':
                return (yield Promise.resolve().then(() => require('./src/commands/generate'))).taoNew(root, commandArgs, isVerbose);
            case 'generate':
            case 'g':
                return (yield Promise.resolve().then(() => require('./src/commands/generate'))).generate(root, commandArgs, isVerbose);
            case 'run':
            case 'r':
                return (yield Promise.resolve().then(() => require('./src/commands/run'))).run(root, commandArgs, isVerbose);
            case 'migrate':
                return (yield Promise.resolve().then(() => require('./src/commands/migrate'))).migrate(root, commandArgs, isVerbose);
            case 'help':
            case '--help':
                return (yield Promise.resolve().then(() => require('./src/commands/help'))).help();
            default: {
                const projectNameIncluded = commandArgs[0] && !commandArgs[0].startsWith('-');
                const projectName = projectNameIncluded ? commandArgs[0] : '';
                // this is to make `tao test mylib` same as `tao run mylib:test`
                return (yield Promise.resolve().then(() => require('./src/commands/run'))).run(root, [
                    `${projectName}:${command}`,
                    ...(projectNameIncluded ? commandArgs.slice(1) : commandArgs),
                ], isVerbose);
            }
        }
    });
}
exports.invokeCommand = invokeCommand;
function invokeCli(root, args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const [command, ...commandArgs] = args;
        process.exit(yield invokeCommand(command, root, commandArgs));
    });
}
exports.invokeCli = invokeCli;
invokeCli(argv.nxWorkspaceRoot || process.cwd(), process.argv.slice(2));
//# sourceMappingURL=index.js.map