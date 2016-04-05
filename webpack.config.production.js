/* eslint-disable no-var */
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './javascripts/app',
  output: {
    path: path.join(__dirname, 'dist', 'javascripts'),
    filename: 'bundle.js'
  },
  resolve: {
    root: path.resolve(__dirname, "javascripts"),
    extensions: ['', '.js', '.jsx']
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/
      },
      {
        test: /\.js?$/,
        loaders: ['babel'],
        exclude: /node_modules/
      }
    ]
  }
};
