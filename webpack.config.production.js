/* eslint-disable no-var */
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './app',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js']
  },
  devtool: 'source-map',
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
        exclude: /node_modules/,
        include: path.join(__dirname, 'scripts')
      },
      ,
      {
        test: /\.js?$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: path.join(__dirname, 'scripts')
      }
    ]
  }
};
