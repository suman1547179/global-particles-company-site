module.exports = function override(config) {
  // Ignore source map warnings for mediapipe
  config.ignoreWarnings = [
    {
      module: /@mediapipe[\\/]tasks-vision/,
    },
  ];

  return config;
};
