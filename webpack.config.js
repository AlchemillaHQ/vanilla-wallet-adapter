const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");

dotenv.config();
const PROD = process.env.NODE_ENV === "production";

module.exports = {
  entry: {
    "solana-wallet-vanilla-adapter": "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "MyLib",
    umdNamedDefine: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/static/index.html",
      inject: false,
      scriptLoading: "blocking",
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
  watchOptions: {
    poll: true,
    aggregateTimeout: 600,
    ignored: ["**/dist/", "**/node_modules"],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      process: "process/browser",
    },
    fallback: {
      process: "process/browser",
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
    },
  },
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  optimization: {
    minimize: PROD,
    minimizer: [new TerserPlugin({ parallel: true })],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist", "bundles"),
    },
    compress: true,
    port: 9000,
  },
};
