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
        mangle: false,
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.(jsx|js)?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          plugins: ['transform-decorators-legacy']
        }      
      }
    ]
  }
};
