"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommunityPlugins = exports.fetchCommunityPlugins = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular-devkit/core");
const axios_1 = require("axios");
const output_1 = require("../output");
const COMMUNITY_PLUGINS_JSON_URL = 'https://raw.githubusercontent.com/nrwl/nx/master/community/approved-plugins.json';
function fetchCommunityPlugins() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(COMMUNITY_PLUGINS_JSON_URL);
        return response.data;
    });
}
exports.fetchCommunityPlugins = fetchCommunityPlugins;
function listCommunityPlugins(installedPlugins, communityPlugins) {
    try {
        const installedPluginsMap = new Set(installedPlugins.map((p) => p.name));
        const availableCommunityPlugins = communityPlugins.filter((p) => !installedPluginsMap.has(p.name));
        output_1.output.log({
            title: `Community plugins:`,
            bodyLines: availableCommunityPlugins.map((p) => {
                return `${core_1.terminal.bold(p.name)} - ${p.description}`;
            }),
        });
    }
    catch (error) {
        output_1.output.warn({
            title: `Community plugins:`,
            bodyLines: [`Error fetching plugins.`, error],
        });
    }
}
exports.listCommunityPlugins = listCommunityPlugins;
//# sourceMappingURL=community-plugins.js.map