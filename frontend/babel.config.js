module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Path alias "@/..." is resolved by Metro from tsconfig.json "paths"
    // (Expo SDK 50+). No extra resolver plugin needed.
  };
};
