const webpack = require("webpack");
const path = require("path");

const config = {
  mode: "development",
  entry: "./src/js/main.js",
  output: {
    path: path.resolve(__dirname, "static"),
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
};

module.exports = config;
