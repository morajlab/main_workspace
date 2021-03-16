import { BuilderContext } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import { DevServerBuildOutput } from '@angular-devkit/build-webpack';
export interface WebDevServerOptions extends JsonObject {
    host: string;
    port: number;
    publicHost?: string;
    ssl: boolean;
    sslKey?: string;
    sslCert?: string;
    proxyConfig?: string;
    buildTarget: string;
    open: boolean;
    liveReload: boolean;
    watch: boolean;
    allowedHosts: string;
    maxWorkers?: number;
    memoryLimit?: number;
    baseHref?: string;
}
declare const _default: import("@angular-devkit/architect/src/internal").Builder<WebDevServerOptions>;
export default _default;
export declare function run(serveOptions: WebDevServerOptions, context: BuilderContext): Observable<DevServerBuildOutput>;
