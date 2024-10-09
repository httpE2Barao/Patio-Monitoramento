module.exports = {
    typescript: {
        ignoreBuildErrors: true,
      },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
        return config;
    }
}