module.exports = function override(config) {
  config.module.rules = config.module.rules.filter(
    rule => !(rule.use && rule.use.some(u => u.loader && u.loader.includes("source-map-loader")))
  );
  return config;
};
