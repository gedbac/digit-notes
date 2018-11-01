const path = require("path");
const CleanupPlugin = require("webpack-cleanup-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  target: "web",
  entry: [
    path.resolve(__dirname, "./src/webapp/public/js/index.js")
  ],
  output: {
    path: path.resolve(__dirname, "./dist/webapp/public"),
    filename: "js/bundle.js",
    publicPath: ""
  },
  resolve: {
    extensions: [ ".web.js", ".js", ".scss" ],
    alias: {
      "infrastructure-logging$": path.resolve(__dirname, "./src/infrastructure/logging/index.js"),
      "infrastructure-util$": path.resolve(__dirname, "./src/infrastructure/util/index.web.js"),
      "infrastructure-dependency-injection$": path.resolve(__dirname, "./src/infrastructure/dependency-injection/index.js")
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: [
        "style-loader",
        {
          loader: MiniCssExtractPlugin.loader
        },
        "css-loader",
        "sass-loader"
      ]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/style.css"
    }),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "./src/webapp/public/index.html"),
      filename: path.resolve(__dirname, "./dist/webapp/public/index.html")
    }),
    new CleanupPlugin()
  ],
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "./dist/webapp/public"),
    compress: true,
    port: 9789
  }
};