const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.resolve('client');

module.exports = {
    entry: [ path.join(src, 'index.js') ],
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
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve('client/index.html'),
      filename: 'index.html',
    })
  ]
};
