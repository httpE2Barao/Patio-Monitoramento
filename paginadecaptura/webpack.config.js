const path = require('path');
const webpack = require('webpack');
const NodeExternals = require('webpack-node-externals');
const dns = require('dns');

module.exports = function override(config, env) {
    config.resolve.fallback = {
        url: require.resolve("url"),
        fs: require.resolve("graceful-fs"),
        buffer: require.resolve("buffer"),
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("node:crypto"),
        assert: require.resolve("assert"),
        dns: require.resolve("node:dns/promises"),
    };
    config.resolve.module = {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'node-loader'
                }
            }
        ]
    }
    config.externals = [NodeExternals()],
    config.ignoreWarnings = [/Failed to parse source map/];

    return config;
};