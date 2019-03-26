const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const CleanupPlugin = require("webpack-cleanup-plugin");
const nodeExternals = require("webpack-node-externals");
const DefinePlugin = webpack.DefinePlugin;

var specNodeConfig = {
  target: "node",
  entry: [
    path.resolve(__dirname, "./spec/infrastructure/logging/index.js"),
    path.resolve(__dirname, "./spec/infrastructure/util/index.js"),
    path.resolve(__dirname, "./spec/infrastructure/events/index.node.js"),
    path.resolve(__dirname, "./spec/infrastructure/repositories/index.js"),
    path.resolve(__dirname, "./spec/infrastructure/cryptography/index.node.js"),
    path.resolve(__dirname, "./spec/infrastructure/text-search/index.js"),
    path.resolve(__dirname, "./spec/infrastructure/dependency-injection/index.js"),
    path.resolve(__dirname, "./spec/outlines/model/index.js"),
    path.resolve(__dirname, "./spec/outlines/repositories/index.node.js")
  ],
  output: {
    path: path.resolve(__dirname, "./dist/spec/node"),
    filename: "amber-notes-infrastructure.spec.js"
  },
  externals: [ nodeExternals() ],
  resolve: {
    extensions: [ ".node.js", ".js" ],
    alias: {
      "amber-notes/infrastructure/logging$": path.resolve(__dirname, "./src/infrastructure/logging/index.js"),
      "amber-notes/infrastructure/util$": path.resolve(__dirname, "./src/infrastructure/util/index.node.js"),
      "amber-notes/infrastructure/model$": path.resolve(__dirname, "./src/infrastructure/model/index.js"),
      "amber-notes/infrastructure/repositories$": path.resolve(__dirname, "./src/infrastructure/repositories/index.js"),
      "amber-notes/infrastructure/events$": path.resolve(__dirname, "./src/infrastructure/events/index.node.js"),
      "amber-notes/infrastructure/cryptography$": path.resolve(__dirname, "./src/infrastructure/cryptography/index.node.js"),
      "amber-notes/infrastructure/text-search$": path.resolve(__dirname, "./src/infrastructure/text-search/index.js"),
      "amber-notes/infrastructure/dependency-injection$": path.resolve(__dirname, "./src/infrastructure/dependency-injection/index.js"),
      "amber-notes/outlines/events$": path.resolve(__dirname, "./src/outlines/events/index.js"),
      "amber-notes/outlines/model$": path.resolve(__dirname, "./src/outlines/model/index.js"),
      "amber-notes/outlines/factories$": path.resolve(__dirname, "./src/outlines/factories/index.js"),
      "amber-notes/outlines/repositories$": path.resolve(__dirname, "./src/outlines/repositories/index.js")
    }
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

var specWebConfig = {
  target: "web",
  entry: [
    path.resolve(__dirname, "./spec/infrastructure/logging/index.js"),
    path.resolve(__dirname, "./spec/infrastructure/util/index.js"),
    path.resolve(__dirname, "./spec/infrastructure/events/index.web.js"),
    path.resolve(__dirname, "./spec/infrastructure/repositories/index.js"),
    path.resolve(__dirname, "./spec/infrastructure/cryptography/index.web.js"),
    path.resolve(__dirname, "./spec/infrastructure/text-search/index.js"),
    path.resolve(__dirname, "./spec/infrastructure/dependency-injection/index.js"),
    path.resolve(__dirname, "./spec/outlines/model/index.js"),
    path.resolve(__dirname, "./spec/outlines/repositories/index.web.js")
  ],
  output: {
    path: path.resolve(__dirname, "./dist/spec/web"),
    filename: "amber-notes-infrastructure.spec.js"
  },
  externals: {
    "chai": "chai",
    "sinon": "sinon"
  },
  resolve: {
    extensions: [ ".web.js", ".js" ],
    alias: {
      "amber-notes/infrastructure/logging$": path.resolve(__dirname, "./src/infrastructure/logging/index.js"),
      "amber-notes/infrastructure/util$": path.resolve(__dirname, "./src/infrastructure/util/index.web.js"),
      "amber-notes/infrastructure/model$": path.resolve(__dirname, "./src/infrastructure/model/index.js"),
      "amber-notes/infrastructure/repositories$": path.resolve(__dirname, "./src/infrastructure/repositories/index.js"),
      "amber-notes/infrastructure/events$": path.resolve(__dirname, "./src/infrastructure/events/index.web.js"),
      "amber-notes/infrastructure/cryptography$": path.resolve(__dirname, "./src/infrastructure/cryptography/index.web.js"),
      "amber-notes/infrastructure/text-search$": path.resolve(__dirname, "./src/infrastructure/text-search/index.js"),
      "amber-notes/infrastructure/dependency-injection$": path.resolve(__dirname, "./src/infrastructure/dependency-injection/index.js"),
      "amber-notes/outlines/events$": path.resolve(__dirname, "./src/outlines/events/index.js"),
      "amber-notes/outlines/model$": path.resolve(__dirname, "./src/outlines/model/index.js"),
      "amber-notes/outlines/factories$": path.resolve(__dirname, "./src/outlines/factories/index.js"),
      "amber-notes/outlines/repositories$": path.resolve(__dirname, "./src/outlines/repositories/index.js")
    }
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
    new CleanupPlugin(),
    new CopyPlugin([{
      from: path.resolve(__dirname, "./node_modules/mocha/mocha.css"),
      to: path.resolve(__dirname, "./dist/spec/web/css")
    }, {
      from: path.resolve(__dirname, "./node_modules/mocha/mocha.js"),
      to: path.resolve(__dirname, "./dist/spec/web/js")
    }, {
      from: path.resolve(__dirname, "./node_modules/chai/chai.js"),
      to: path.resolve(__dirname, "./dist/spec/web/js")
    }, {
      from: path.resolve(__dirname, "./node_modules/sinon/pkg/sinon.js"),
      to: path.resolve(__dirname, "./dist/spec/web/js")
    }, {
      from: path.resolve(__dirname, "./spec/spec-runner.html"),
      to: path.resolve(__dirname, "./dist/spec/web")
    }])
  ],
  devtool: "source-map"
};

module.exports = [
  specNodeConfig,
  specWebConfig
];