"use strict";

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
  entry: {
    app: path.resolve("./src/core/bootstrap.js")
  },
  output: {
    filename: "bundle.js",
    chunkFilename: "[name].bundle.js",
    path: path.resolve(__dirname + "build")
  },
  module: {
    rules: [
      // js
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },

      // html
      {
        test: /\.html$/,
        loader: "raw-loader",
        exclude: path.resolve("./src/index.html")
      },

      // css
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve("./src/index.html")
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: "common",
      filename: "common.js",
      minChunks: (module) => {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
    }),

    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    new ExtractTextPlugin({
      filename: "[name].css",
      allChunks: true
    })
  ],
  devServer: {
    contentBase: path.resolve("build"),
    hot: true,
    host: process.env.host || "localhost",
    port: process.env.PORT || 5000
  }
};

module.exports = config;
