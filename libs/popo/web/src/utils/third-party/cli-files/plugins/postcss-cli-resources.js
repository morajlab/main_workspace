"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const loader_utils_1 = require("loader-utils");
const path = require("path");
const postcss = require("postcss");
const url = require("url");
function wrapUrl(url) {
    let wrappedUrl;
    const hasSingleQuotes = url.indexOf("'") >= 0;
    if (hasSingleQuotes) {
        wrappedUrl = `"${url}"`;
    }
    else {
        wrappedUrl = `'${url}'`;
    }
    return `url(${wrappedUrl})`;
}
function resolve(file, base, resolver) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            return yield resolver('./' + file, base);
        }
        catch (_a) {
            return resolver(file, base);
        }
    });
}
exports.default = postcss.plugin('postcss-cli-resources', (options) => {
    const { deployUrl = '', baseHref = '', resourcesOutputPath = '', rebaseRootRelative = false, filename, loader, } = options;
    const dedupeSlashes = (url) => url.replace(/\/\/+/g, '/');
    const process = (inputUrl, context, resourceCache) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        // If root-relative, absolute or protocol relative url, leave as is
        if (/^((?:\w+:)?\/\/|data:|chrome:|#)/.test(inputUrl)) {
            return inputUrl;
        }
        if (!rebaseRootRelative && /^\//.test(inputUrl)) {
            return inputUrl;
        }
        // If starts with a caret, remove and return remainder
        // this supports bypassing asset processing
        if (inputUrl.startsWith('^')) {
            return inputUrl.substr(1);
        }
        const cacheKey = path.resolve(context, inputUrl);
        const cachedUrl = resourceCache.get(cacheKey);
        if (cachedUrl) {
            return cachedUrl;
        }
        if (inputUrl.startsWith('~')) {
            inputUrl = inputUrl.substr(1);
        }
        if (inputUrl.startsWith('/')) {
            let outputUrl = '';
            if (deployUrl.match(/:\/\//) || deployUrl.startsWith('/')) {
                // If deployUrl is absolute or root relative, ignore baseHref & use deployUrl as is.
                outputUrl = `${deployUrl.replace(/\/$/, '')}${inputUrl}`;
            }
            else if (baseHref.match(/:\/\//)) {
                // If baseHref contains a scheme, include it as is.
                outputUrl =
                    baseHref.replace(/\/$/, '') +
                        dedupeSlashes(`/${deployUrl}/${inputUrl}`);
            }
            else {
                // Join together base-href, deploy-url and the original URL.
                outputUrl = dedupeSlashes(`/${baseHref}/${deployUrl}/${inputUrl}`);
            }
            resourceCache.set(cacheKey, outputUrl);
            return outputUrl;
        }
        const { pathname, hash, search } = url.parse(inputUrl.replace(/\\/g, '/'));
        const resolver = (file, base) => new Promise((resolve, reject) => {
            loader.resolve(base, decodeURI(file), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
        const result = yield resolve(pathname, context, resolver);
        return new Promise((resolve, reject) => {
            loader.fs.readFile(result, (err, content) => {
                if (err) {
                    reject(err);
                    return;
                }
                let outputPath = loader_utils_1.interpolateName({ resourcePath: result }, filename, { content });
                if (resourcesOutputPath) {
                    outputPath = path.posix.join(resourcesOutputPath, outputPath);
                }
                loader.addDependency(result);
                loader.emitFile(outputPath, content, undefined);
                let outputUrl = outputPath.replace(/\\/g, '/');
                if (hash || search) {
                    outputUrl = url.format({ pathname: outputUrl, hash, search });
                }
                if (deployUrl &&
                    loader.loaders[loader.loaderIndex].options.ident !== 'extracted') {
                    outputUrl = url.resolve(deployUrl, outputUrl);
                }
                resourceCache.set(cacheKey, outputUrl);
                resolve(outputUrl);
            });
        });
    });
    return (root) => {
        const urlDeclarations = [];
        root.walkDecls((decl) => {
            if (decl.value && decl.value.includes('url')) {
                urlDeclarations.push(decl);
            }
        });
        if (urlDeclarations.length === 0) {
            return;
        }
        const resourceCache = new Map();
        return Promise.all(urlDeclarations.map((decl) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const value = decl.value;
            const urlRegex = /url\(\s*(?:"([^"]+)"|'([^']+)'|(.+?))\s*\)/g;
            const segments = [];
            let match;
            let lastIndex = 0;
            let modified = false;
            // We want to load it relative to the file that imports
            const inputFile = decl.source && decl.source.input.file;
            const context = (inputFile && path.dirname(inputFile)) || loader.context;
            // tslint:disable-next-line:no-conditional-assignment
            while ((match = urlRegex.exec(value))) {
                const originalUrl = match[1] || match[2] || match[3];
                let processedUrl;
                try {
                    processedUrl = yield process(originalUrl, context, resourceCache);
                }
                catch (err) {
                    loader.emitError(decl.error(err.message, { word: originalUrl }).toString());
                    continue;
                }
                if (lastIndex < match.index) {
                    segments.push(value.slice(lastIndex, match.index));
                }
                if (!processedUrl || originalUrl === processedUrl) {
                    segments.push(match[0]);
                }
                else {
                    segments.push(wrapUrl(processedUrl));
                    modified = true;
                }
                lastIndex = match.index + match[0].length;
            }
            if (lastIndex < value.length) {
                segments.push(value.slice(lastIndex));
            }
            if (modified) {
                decl.value = segments.join('');
            }
        })));
    };
});
//# sourceMappingURL=postcss-cli-resources.js.map