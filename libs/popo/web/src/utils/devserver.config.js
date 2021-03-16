"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDevServerConfig = void 0;
const fs_1 = require("fs");
const path = require("path");
const web_config_1 = require("./web.config");
const serve_path_1 = require("./serve-path");
function getDevServerConfig(root, sourceRoot, buildOptions, serveOptions, logger) {
    const webpackConfig = web_config_1.getWebConfig(root, sourceRoot, buildOptions, logger, true, // Don't need to support legacy browsers for dev.
    false);
    webpackConfig.devServer = getDevServerPartial(root, serveOptions, buildOptions);
    return webpackConfig;
}
exports.getDevServerConfig = getDevServerConfig;
function getDevServerPartial(root, options, buildOptions) {
    const servePath = serve_path_1.buildServePath(buildOptions);
    const { scripts: scriptsOptimization, styles: stylesOptimization, } = buildOptions.optimization;
    const config = {
        host: options.host,
        port: options.port,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
            index: `${servePath}/${path.basename(buildOptions.index)}`,
            disableDotRule: true,
            htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
        },
        stats: false,
        compress: scriptsOptimization || stylesOptimization,
        https: options.ssl,
        overlay: {
            errors: !(scriptsOptimization || stylesOptimization),
            warnings: false,
        },
        watchOptions: {
            poll: buildOptions.poll,
        },
        public: options.publicHost,
        publicPath: servePath,
        contentBase: false,
        allowedHosts: [],
        liveReload: options.liveReload,
    };
    if (options.ssl && options.sslKey && options.sslCert) {
        config.https = getSslConfig(root, options);
    }
    if (options.proxyConfig) {
        config.proxy = getProxyConfig(root, options);
    }
    if (options.allowedHosts) {
        config.allowedHosts = options.allowedHosts.split(',');
    }
    return config;
}
function getSslConfig(root, options) {
    return {
        key: fs_1.readFileSync(path.resolve(root, options.sslKey), 'utf-8'),
        cert: fs_1.readFileSync(path.resolve(root, options.sslCert), 'utf-8'),
    };
}
function getProxyConfig(root, options) {
    const proxyPath = path.resolve(root, options.proxyConfig);
    return require(proxyPath);
}
//# sourceMappingURL=devserver.config.js.map