module.exports = {
  getRule: (config, pattern) =>
    config.module.rules.filter(({ test }) => pattern.test(test)),
};
