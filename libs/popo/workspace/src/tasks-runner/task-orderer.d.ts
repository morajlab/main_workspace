import { ProjectGraph } from '../core/project-graph';
import { Task } from './tasks-runner';
import { DefaultTasksRunnerOptions } from '@nrwl/workspace/src/tasks-runner/default-tasks-runner';
export declare class TaskOrderer {
    private readonly options;
    private readonly target;
    private readonly projectGraph;
    constructor(options: DefaultTasksRunnerOptions, target: string, projectGraph: ProjectGraph);
    splitTasksIntoStages(tasks: Task[]): any[];
    private taskDependsOnDeps;
    private topologicallySortTasks;
}
