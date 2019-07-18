const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./client/index.js"),
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "www")
  },
  resolve: {
    modules: [path.resolve(__dirname, "./node_modules")]
  }
};
