const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const src = path.resolve('client');

module.exports = {
  entry: [path.join(src, 'index.js'), 'whatwg-fetch'],
  output: {
    path: path.resolve('dist'),
    filename: 'scripts.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        // include: src,
        loader: 'babel-loader',
        options: {
          presets: ['env'],
        }
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve('client/index.html'),
      filename: 'index.html',
    }),
    new webpack.ProvidePlugin({
      Promise: 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise',
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
  ]
};
