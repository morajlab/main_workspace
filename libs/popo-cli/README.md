popo-cli
========

POPO cli tool

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/popo-cli.svg)](https://npmjs.org/package/popo-cli)
[![Downloads/week](https://img.shields.io/npm/dw/popo-cli.svg)](https://npmjs.org/package/popo-cli)
[![License](https://img.shields.io/npm/l/popo-cli.svg)](https://github.com/morteza-jamali/popo-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g popo-cli
$ popo COMMAND
running command...
$ popo (-v|--version|version)
popo-cli/0.0.0 win32-x64 node-v14.13.1
$ popo --help [COMMAND]
USAGE
  $ popo COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`popo hello [FILE]`](#popo-hello-file)
* [`popo help [COMMAND]`](#popo-help-command)

## `popo hello [FILE]`

describe the command here

```
USAGE
  $ popo hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ popo hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/morteza-jamali/popo-cli/blob/v0.0.0/src/commands/hello.ts)_

## `popo help [COMMAND]`

display help for popo

```
USAGE
  $ popo help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
