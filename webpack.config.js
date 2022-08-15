const webpack = require("webpack");
const path = require("path");

const config = {
  mode: "development",
  entry: "./src/js/main.js",
  output: {
    path: path.resolve(__dirname, "dst"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ["raw-loader", "glslify-loader"],
      },
    ],
  },
  devServer: {
    static: "./dst",
  },
};

module.exports = config;
