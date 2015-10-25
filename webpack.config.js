var path = require("path");
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './app/scripts/index.js',
  resolve: {
    root: [path.join(__dirname, "bower_components")]
  },

  output: {
    filename: 'index.js',
    path: __dirname + '/dist',
    libraryTarget: 'umd'
  },

  module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules|bower_components/, loader: 'babel-loader' },
        { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader' },
        {
          test: /\.sass$/,
          loaders: [
            "style",
            "css",
            "autoprefixer?browsers=last 2 version",
            "sass?indentedSyntax",
          ],
        },
      ],
    },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'mashupfm',
      template: './app/html/index.html',
      filename: 'index.html'
    })

    // new webpack.ResolverPlugin(
    //   new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    // )
  ],

}
