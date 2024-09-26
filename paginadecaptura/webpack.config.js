const path = require('path');
const fastify = require('fastify');
const fastifyFormbody = require('@fastify/formbody');
const { schema } = require('./src/api/schema-zod.ts'); 

module.exports = {
  mode: 'production',
  entry: './src/app/layout.tsx', 
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output directory for the bundled file
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: '@babel/loader',
          options: {
            presets: ['@babel/preset-env'], // Transpile modern JavaScript for browser compatibility
          },
        },
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
};