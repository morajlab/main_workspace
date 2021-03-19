declare module "detect-indent";
declare module "detect-newline";
declare module "parse-json";
declare module "clean-stack";
declare module "semver";
declare module "ci-parallel-vars";
declare module "cmd-shim";
declare module "read-cmd-shim";
declare module "pkg-up";
declare module "typeable-promisify";
declare module "make-dir";
declare module "rimraf";
declare module "p-limit";
declare module "slash";
declare module "temp-write";
declare module "multimatch";
declare module "cross-spawn";
declare module "inquirer";
declare module "path-is-inside";
declare module "array-includes";
declare module "project-bin-path";
declare module "sort-object";
declare module "chunkd";
declare module "task-graph-runner";

declare namespace BoltTypes {
  type DependencySet = {
    [key: string]: string;
  };

  type Scripts = {
    [script: string]: string;
  };

  type JSONValue =
    | null
    | string
    | boolean
    | number
    | Array<JSONValue>
    | { [key: string]: JSONValue };

  type SpawnOpts = {
    orderMode?: "serial" | "parallel" | "parallel-nodes";
    bail?: boolean;
    excludeFromGraph?: Array<configDependencyType>;
  };

  type FilterOpts = {
    only?: string;
    ignore?: string;
    onlyFs?: string;
    ignoreFs?: string;
  };

  type Dependency = {
    name: string;
    version?: string;
  };

  type configDependencyType =
    | "dependencies"
    | "devDependencies"
    | "peerDependencies"
    | "optionalDependencies";

  type LockFileMode = "default" | "pure" | "frozen";
}
