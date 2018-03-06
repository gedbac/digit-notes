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
    path.resolve(__dirname, "./spec/infrastructure/util/index.node.js"),
    path.resolve(__dirname, "./spec/infrastructure/events/index.node.js"),
    path.resolve(__dirname, "./spec/infrastructure/cryptography/index.js"),
    path.resolve(__dirname, "./spec/outlines/model/index.js"),
    path.resolve(__dirname, "./spec/outlines/repositories/index.node.js")
  ],
  output: {
    path: path.resolve(__dirname, "./dist/node"),
    filename: "amber-notes-infrastructure.spec.js"
  },
  externals: [ nodeExternals() ],
  resolve: {
    extensions: [ ".node.js", ".js" ],
    alias: {
      "amber-notes-infrastructure-util$": path.resolve(__dirname, "./src/infrastructure/util/index.node.js"),
      "amber-notes-infrastructure-model$": path.resolve(__dirname, "./src/infrastructure/model/index.js"),
      "amber-notes-infrastructure-repositories$": path.resolve(__dirname, "./src/infrastructure/repositories/index.js"),
      "amber-notes-infrastructure-events$": path.resolve(__dirname, "./src/infrastructure/events/index.node.js"),
      "amber-notes-infrastructure-cryptography$": path.resolve(__dirname, "./src/infrastructure/cryptography/index.js"),
      "amber-notes-outlines-events$": path.resolve(__dirname, "./src/outlines/events/index.js"),
      "amber-notes-outlines-model$": path.resolve(__dirname, "./src/outlines/model/index.js"),
      "amber-notes-outlines-factories$": path.resolve(__dirname, "./src/outlines/factories/index.js"),
      "amber-notes-outlines-repositories$": path.resolve(__dirname, "./src/outlines/repositories/index.js")
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
    path.resolve(__dirname, "./spec/infrastructure/util/index.web.js"),
    path.resolve(__dirname, "./spec/infrastructure/events/index.web.js"),
    path.resolve(__dirname, "./spec/infrastructure/cryptography/index.js"),
    path.resolve(__dirname, "./spec/outlines/model/index.js"),
    path.resolve(__dirname, "./spec/outlines/repositories/index.web.js")
  ],
  output: {
    path: path.resolve(__dirname, "./dist/web"),
    filename: "amber-notes-infrastructure.spec.js"
  },
  externals: {
    chai: "chai"
  },
  resolve: {
    extensions: [ ".web.js", ".js" ],
    alias: {
      "amber-notes-infrastructure-util$": path.resolve(__dirname, "./src/infrastructure/util/index.web.js"),
      "amber-notes-infrastructure-model$": path.resolve(__dirname, "./src/infrastructure/model/index.js"),
      "amber-notes-infrastructure-repositories$": path.resolve(__dirname, "./src/infrastructure/repositories/index.js"),
      "amber-notes-infrastructure-events$": path.resolve(__dirname, "./src/infrastructure/events/index.web.js"),
      "amber-notes-infrastructure-cryptography$": path.resolve(__dirname, "./src/infrastructure/cryptography/index.js"),
      "amber-notes-outlines-events$": path.resolve(__dirname, "./src/outlines/events/index.js"),
      "amber-notes-outlines-model$": path.resolve(__dirname, "./src/outlines/model/index.js"),
      "amber-notes-outlines-factories$": path.resolve(__dirname, "./src/outlines/factories/index.js"),
      "amber-notes-outlines-repositories$": path.resolve(__dirname, "./src/outlines/repositories/index.js")
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