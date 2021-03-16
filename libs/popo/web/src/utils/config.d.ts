import * as webpack from 'webpack';
import { Configuration } from 'webpack';
import { AssetGlobPattern, BuildBuilderOptions } from './types';
export declare function getBaseWebpackPartial(options: BuildBuilderOptions, esm?: boolean, isScriptOptimizeOn?: boolean, configuration?: string): Configuration;
export declare function createTerserPlugin(esm: boolean, sourceMap: boolean): any;
export declare function createCopyPlugin(assets: AssetGlobPattern[]): webpack.Plugin;
