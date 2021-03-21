import { Command, flags } from "@oclif/command";
import Project from "../lib/Project";
import validateProject from "../lib/utils/validateProject";
import { BoltError } from "../lib/utils/errors";
import {
  info as loggerInfo,
  success as loggerSuccess,
} from "../lib/utils/logger";
import * as yarn from "../lib/utils/yarn";
import symlinkPackageDependencies from "../lib/utils/symlinkPackageDependencies";
import symlinkPackagesBinaries from "../lib/utils/symlinkPackagesBinariesToProject";

export default class InstallCommand extends Command {
  static description = "Packages install command description";

  static flags = {
    root: flags.string(),
  };

  async run() {
    const { flags } = this.parse(InstallCommand);
    let cwd = flags.root ?? process.cwd();

    let project = await Project.init(cwd);
    let packages = await project.getPackages();

    loggerInfo("validatingProject" /*messages.validatingProject()*/, {
      emoji: "🔎",
      prefix: false,
    });

    let projectIsValid = await validateProject(project);

    if (!projectIsValid) {
      throw new BoltError("unableToInstall" /*messages.unableToInstall()*/);
    }

    loggerInfo(
      "installingProjectDependencies" /*messages.installingProjectDependencies()*/,
      {
        emoji: "📦",
        prefix: false,
      }
    );

    await yarn.install(project.pkg.dir /*opts.lockfileMode*/);

    loggerInfo(
      "linkingWorkspaceDependencies" /*messages.linkingWorkspaceDependencies()*/,
      {
        emoji: "🔗",
        prefix: false,
      }
    );

    let { graph, valid } = await project.getDependencyGraph(packages);

    if (!valid) {
      throw new BoltError("Cannot symlink invalid set of dependencies.");
    }

    await Promise.all(
      packages.map(async (pkg: any) => {
        let dependencies = Array.from(pkg.getAllDependencies().keys());
        await symlinkPackageDependencies(
          project,
          pkg,
          dependencies as string[],
          graph
        );
      })
    );

    loggerInfo(
      "linkingWorkspaceBinaries" /*messages.linkingWorkspaceBinaries()*/,
      {
        emoji: "🚀",
        prefix: false,
      }
    );

    await symlinkPackagesBinaries(project);

    loggerSuccess(
      "installedAndLinkedWorkspaces" /*messages.installedAndLinkedWorkspaces()*/,
      { emoji: "💥" }
    );
  }
}
