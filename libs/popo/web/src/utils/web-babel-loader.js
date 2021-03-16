var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
module.exports = require('babel-loader').custom((babel) => {
    return {
        customOptions(_a) {
            var { isModern } = _a, loader = __rest(_a, ["isModern"]);
            return {
                custom: { isModern },
                loader,
            };
        },
        config(cfg, { customOptions: { isModern } }) {
            // Add hint to our babel preset so it can handle modern vs legacy bundles.
            cfg.options.caller.isModern = isModern;
            return cfg.options;
        },
    };
});
//# sourceMappingURL=web-babel-loader.js.map