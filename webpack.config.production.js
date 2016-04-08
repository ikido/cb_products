/* eslint-disable no-var */
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './javascripts/app',
  output: {
    path: path.join(__dirname, 'dist', 'js'),
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
      },
      mangle: {
        keep_fnames: true
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
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
