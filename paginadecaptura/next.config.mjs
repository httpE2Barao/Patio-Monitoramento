import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
    webpack: (config) => {
        config.plugins.push(new NodePolyfillPlugin());
        return config;
    },
};

export default nextConfig;
