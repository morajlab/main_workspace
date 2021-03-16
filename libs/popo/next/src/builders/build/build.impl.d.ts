import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { NextBuildBuilderOptions } from '../../utils/types';
declare const _default: import("@angular-devkit/architect/src/internal").Builder<NextBuildBuilderOptions>;
export default _default;
export declare function run(options: NextBuildBuilderOptions, context: BuilderContext): Observable<BuilderOutput>;
