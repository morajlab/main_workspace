import { Task, TasksRunner } from './tasks-runner';
import { ReporterArgs } from './default-reporter';
import * as yargs from 'yargs';
import { ProjectGraph, ProjectGraphNode } from '../core/project-graph';
import { Environment, NxJson } from '../core/shared-interfaces';
import { NxArgs } from '@nrwl/workspace/src/command-line/utils';
declare type RunArgs = yargs.Arguments & ReporterArgs;
export declare function runCommand<T extends RunArgs>(projectsToRun: ProjectGraphNode[], projectGraph: ProjectGraph, { nxJson, workspaceResults }: Environment, nxArgs: NxArgs, overrides: any, reporter: any, initiatingProject: string | null): Promise<void>;
export interface TaskParams {
    project: ProjectGraphNode;
    target: string;
    configuration: string;
    overrides: Object;
}
export declare function createTask({ project, target, configuration, overrides, }: TaskParams): Task;
export declare function getRunner(nxArgs: NxArgs, nxJson: NxJson, overrides: any): {
    tasksRunner: TasksRunner;
    tasksOptions: unknown;
};
export {};
