const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const path = require("path");

rules.push({
    test: /\.css$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }]
});

rules.push({
    test: /\.(ttf|png|bmp)$/,
    type: "asset/resource"
});

module.exports = {
    module: {
        rules,
    },
    plugins: plugins,
    resolve: {
        alias: {
            src: path.resolve(__dirname, "src/"),
            assets: path.resolve(__dirname, "assets/")
        },
        extensions: [".js", ".ts", ".jsx", ".tsx", ".css"]
    },
    /* By default, in development mode, electron-webpack uses eval() calls for source maps.
     * This approach is faster, but it would require a less restrictive content security
     * policy for development. I decided not to compromise security for faster builds.
     * Using "source-map" devtool setting would be ideal, but then the app can't load
     * source maps of preload script(s) for some reason, hence the "inline" option...
     */
    devtool: "inline-source-map"
};
