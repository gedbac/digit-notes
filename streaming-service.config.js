const path = require("path");
const webpack = require("webpack");
const CleanupPlugin = require("webpack-cleanup-plugin");
const DefinePlugin = webpack.DefinePlugin;
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  entry: [
    path.resolve(__dirname, "./src/streaming-service/index.js")
  ],
  output: {
    path: path.resolve(__dirname, "./dist/streaming-service"),
    filename: "streaming-service.js"
  },
  externals: [ nodeExternals() ],
  resolve: {
    extensions: [ ".node.js", ".js" ]
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        "babel-loader",
        "eslint-loader"
      ]
    }]
  },
  plugins: [
    new DefinePlugin({
      DEBUG: true
    }),
    new CleanupPlugin()
  ],
  devtool: "source-map"
};