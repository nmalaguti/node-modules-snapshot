var webpack = require('webpack');

module.exports = {
  target: 'node',
  entry: './lib/cli.js',
  output: {
    path: './dist',
    filename: 'cli.js'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
    ]
  },
  plugins: [
    new webpack.BannerPlugin('#!/usr/bin/env node', { raw: true })
  ]
}
