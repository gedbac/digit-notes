const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const CleanupPlugin = require("webpack-cleanup-plugin");
const nodeExternals = require("webpack-node-externals");
const DefinePlugin = webpack.DefinePlugin;

var nodeConfig = {
  target: "node",
  mode: "development",
  entry: [
    path.resolve(__dirname, "./spec/infrastructure/util/index.js")
  ],
  output: {
    path: path.resolve(__dirname, "./dist/node"),
    filename: "amber-notes-infrastructure.spec.js"
  },
  externals: [ nodeExternals() ],
  resolve: {
    extensions: [ ".js" ],
    alias: {
      "amber-notes-infrastructure-util$": path.resolve(__dirname, "./src/infrastructure/util/index.js")
    }
  },
  plugins: [
    new DefinePlugin({
      DEBUG: true
    }),
    new CleanupPlugin()
  ],
  devtool: "source-map"
};

var webConfig = {
  target: "web",
  mode: "development",
  entry: [
    path.resolve(__dirname, "./spec/infrastructure/util/index.js"),
  ],
  output: {
    path: path.resolve(__dirname, "./dist/web"),
    filename: "amber-notes-infrastructure.spec.js"
  },
  externals: {
    chai: "chai"
  },
  resolve: {
    extensions: [ ".js" ],
    alias: {
      "amber-notes-infrastructure-util$": path.resolve(__dirname, "./src/infrastructure/util/index.js"),
    }
  },
  plugins: [
    new DefinePlugin({
      DEBUG: true
    }),
    new CleanupPlugin(),
    new CopyPlugin([{
      from: path.resolve(__dirname, "./node_modules/mocha/mocha.css"),
      to: path.resolve(__dirname, "./dist/web/css")
    }, {
      from: path.resolve(__dirname, "./node_modules/mocha/mocha.js"),
      to: path.resolve(__dirname, "./dist/web/js")
    }, {
      from: path.resolve(__dirname, "./node_modules/chai/chai.js"),
      to: path.resolve(__dirname, "./dist/web/js")
    }, {
      from: path.resolve(__dirname, "./spec/spec-runner.html"),
      to: path.resolve(__dirname, "./dist/web")
    }])
  ],
  devtool: "source-map"
};

module.exports = [ nodeConfig, webConfig ];