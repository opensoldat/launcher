const rules = require("./webpack.rules");
const alias = require("./webpack.alias");

rules.push({
  test: /\.png$/,
  type: "asset/resource",
});

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/electron/main.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    alias,
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
};
