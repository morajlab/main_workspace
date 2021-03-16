"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultServer = void 0;
const tslib_1 = require("tslib");
const express = require("express");
const next_1 = require("next");
/**
 * Adapted from https://github.com/zeit/next.js/blob/master/examples/with-custom-reverse-proxy/server.js
 * @param settings
 */
function defaultServer(settings, proxyConfig) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const app = next_1.default(settings);
        const handle = app.getRequestHandler();
        yield app.prepare();
        const server = express();
        // Set up the proxy.
        if (proxyConfig) {
            const proxyMiddleware = require('http-proxy-middleware');
            Object.keys(proxyConfig).forEach((context) => {
                server.use(proxyMiddleware(context, proxyConfig[context]));
            });
        }
        // Default catch-all handler to allow Next.js to handle all other routes
        server.all('*', (req, res) => handle(req, res));
        server.listen(settings.port, settings.hostname);
    });
}
exports.defaultServer = defaultServer;
//# sourceMappingURL=default-server.js.map