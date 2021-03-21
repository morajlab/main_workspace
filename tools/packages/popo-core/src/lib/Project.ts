import { dirname, join } from "path";
//import includes from 'array-includes';
import semver from "semver";
import Package from "./Package";
import Config from "./Config";
import { stat } from "./utils/fs";
import { error as loggerError } from "./utils/logger";
/*import {
  promiseWrapper,
  promiseWrapperSuccess,
  PromiseResult,
  PromiseFailure
} from './utils/promiseWrapper';
import * as messages from './utils/messages';*/
import { BoltError } from "./utils/errors";
import { findWorkspaces } from "./utils/globs";
/*import taskGraphRunner from 'task-graph-runner';
import * as env from './utils/env';
import chunkd from 'chunkd';*/

/*type GenericTask<T> = (pkg: Package) => Promise<T>;

type TaskResult = PromiseResult<mixed> | void;

type InternalTask = GenericTask<TaskResult>;

export type Task = GenericTask<mixed>;

const taskWrapper = (task: Task, bail?: boolean): InternalTask => {
  if (bail === undefined || bail) {
    return promiseWrapperSuccess(task);
  }

  return promiseWrapper(task);
}*/

export default class Project {
  pkg: Package;

  constructor(pkg: Package) {
    this.pkg = pkg;
  }

  static init = async (cwd: string) => {
    let filePath = await Config.getProjectConfig(cwd);

    if (!filePath)
      throw new BoltError(`Unable to find root of project in ${cwd}`);

    let pkg = await Package.init(filePath);

    return new Project(pkg);
  };

  getPackages = async () => {
    let queue = [this.pkg];
    let packages: any = [];

    for (let item of queue) {
      let cwd = dirname(item.filePath);
      let patterns = item.getWorkspacesConfig();
      let matchedPaths = await findWorkspaces(cwd, patterns);

      for (let matchedPath of matchedPaths) {
        let dir = join(cwd, matchedPath);
        let stats = await stat(dir);

        if (!stats.isDirectory()) continue;

        let filePath = join(dir, "package.json");
        let pkg;

        try {
          pkg = await Package.init(filePath);
        } catch (error) {
          if (error instanceof BoltError) {
            continue;
          }

          throw error;
        }

        queue.push(pkg);
        packages.push(pkg);
      }
    }

    return packages;
  };

  getDependencyGraph = async (
    packages: Package[],
    excludedDependencyTypes: BoltTypes.configDependencyType[] | void
  ) => {
    let graph: Map<
      string,
      { pkg: Package; dependencies: string[] }
    > = new Map();
    let queue = [this.pkg];
    let packagesByName = { [this.pkg.getName()]: this.pkg };
    let valid = true;

    for (let pkg of packages) {
      queue.push(pkg);
      packagesByName[pkg.getName()] = pkg;
    }

    for (let pkg of queue) {
      let name = pkg.config.getName();
      let dependencies = [];
      let allDependencies = pkg.getAllDependencies(
        excludedDependencyTypes as any
      );

      for (let [depName, depVersion] of allDependencies) {
        let match = packagesByName[depName];

        if (!match) continue;

        let expected = match.config.getVersion();

        if (!semver.satisfies(expected, depVersion)) {
          valid = false;

          loggerError(
            "packageMustDependOnCurrentVersion"
            /*messages.packageMustDependOnCurrentVersion(
              name,
              depName,
              expected,
              depVersion
            )*/
          );

          continue;
        }

        dependencies.push(depName);
      }

      graph.set(name, { pkg, dependencies });
    }

    return { graph, valid };
  }; /*

  async getDependentsGraph(
    packages: Array<Package>,
    excludedDepTypes?: Array<BoltTypes.configDependencyType>
  ) {
    let graph = new Map();
    let { valid, graph: dependencyGraph } = await this.getDependencyGraph(
      packages,
      excludedDepTypes
    );

    let dependentsLookup: any = {};

    packages.forEach(pkg => {
      dependentsLookup[pkg.config.getName()] = {
        pkg,
        dependents: []
      };
    });

    packages.forEach(pkg => {
      let dependent = pkg.getName();
      let valFromDependencyGraph: any = dependencyGraph.get(dependent) || {};
      let dependencies = valFromDependencyGraph.dependencies || [];

      dependencies.forEach((dependency: any) => {
        dependentsLookup[dependency].dependents.push(dependent);
      });
    });

    Object.keys(dependentsLookup).forEach(key => {
      graph.set(key, dependentsLookup[key]);
    });

    return { valid, graph };
  }

  async runPackageTasks(
    packages: Array<Package>,
    spawnOpts: BoltTypes.SpawnOpts,
    task: Task
  ) {
    const wrappedTask = taskWrapper(task, spawnOpts.bail);
    let results: TaskResult[];

    if (spawnOpts.orderMode === 'serial') {
      results = await this.runPackageTasksSerial(packages, wrappedTask);
    } else if (spawnOpts.orderMode === 'parallel') {
      results = await this.runPackageTasksParallel(packages, wrappedTask);
    } else if (spawnOpts.orderMode === 'parallel-nodes') {
      results = await this.runPackageTasksParallelNodes(packages, wrappedTask);
    } else {
      results = await this.runPackageTasksGraphParallel(
        packages,
        wrappedTask,
        spawnOpts.excludeFromGraph
      );
    }

    const taskFailures: Array<PromiseFailure> = (results.filter(
      r => r && r.status === 'error'
    ) as any);

    if (taskFailures.length > 0) {
      const failuresWithMsg = taskFailures
        .map(r => r.error && r.error.message)
        .filter(Boolean);

      throw new BoltError(
        messages.taskFailed(taskFailures.length, failuresWithMsg)
      );
    }
  }

  async runPackageTasksSerial<T>(
    packages: Array<Package>,
    task: GenericTask<T>
  ): Promise<Array<T>> {
    const results: Array<T> = [];

    for (let pkg of packages) {
      results.push(await task(pkg));
    }

    return results;
  }

  runPackageTasksParallel<T>(
    packages: Array<Package>,
    task: GenericTask<T>
  ): Promise<Array<T>> {
    return Promise.all(packages.map(pkg => task(pkg)));
  }

  async runPackageTasksParallelNodes<T>(
    packages: Array<Package>,
    task: GenericTask<T>
  ): Promise<Array<T>> {
    packages = packages.sort((a, b) => a.filePath.localeCompare(b.filePath, [], { numeric: true }));

    let index = env.get('CI_NODE_INDEX');
    let total = env.get('CI_NODE_TOTAL');

    if (typeof index === 'number' && typeof total === 'number') {
      let all = packages.length;
      packages = chunkd(packages, index, total);

      logger.info(
        messages.taskRunningAcrossCINodes(total, packages.length, all)
      );
    }

    return this.runPackageTasksParallel(packages, task);
  }

  async runPackageTasksGraphParallel<T>(
    packages: Array<Package>,
    task: GenericTask<T>,
    excludeDepTypesFromGraph: Array<BoltTypes.configDependencyType> | void
  ): Promise<Array<T | void>> {
    let { graph: dependentsGraph } = await this.getDependencyGraph(
      packages,
      excludeDepTypesFromGraph
    );

    let graph = new Map();

    for (let [pkgName, pkgInfo] of dependentsGraph) {
      graph.set(pkgName, pkgInfo.dependencies);
    }

    let results = await taskGraphRunner({
      graph,
      force: true,
      task: async (pkgName: any) => {
        let pkg = this.getPackageByName(packages, pkgName);

        if (pkg) {
          return task(pkg);
        }
      }
    });

    let {
      safe,
      values
    }: { safe: boolean, values: Map<string, T | void> } = (results: {
      safe: boolean,
      // The value type of the Map is wrong so we cast it to any and recast to the correct type
      values: Map<string, any>
    });

    if (!safe) {
      logger.warn(messages.unsafeCycles());
    }
    return [...values.values()];
  }

  getPackageByName(packages: Array<Package>, pkgName: string) {
    return packages.find(pkg => pkg.getName() === pkgName);
  }

  filterPackages(packages: Array<Package>, opts: BoltTypes.FilterOpts) {
    let relativeDir = (pkg: Package) => path.relative(this.pkg.dir, pkg.dir);

    let packageNames = packages.map(pkg => pkg.getName());
    let packageDirs = packages.map(pkg => relativeDir(pkg));

    let filteredByName = globs.matchOnlyAndIgnore(
      packageNames,
      opts.only,
      opts.ignore
    );

    let filteredByDir = globs.matchOnlyAndIgnore(
      packageDirs,
      opts.onlyFs,
      opts.ignoreFs
    );

    let filteredPackages = packages.filter(
      pkg =>
        includes(filteredByName, pkg.getName()) &&
        includes(filteredByDir, relativeDir(pkg))
    );

    if (filteredPackages.length === 0) {
      logger.warn(messages.noPackagesMatchFilters());
    }

    return filteredPackages;
  }*/
}