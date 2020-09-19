const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const path = require("path");

rules.push({
    test: /\.css$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }]
});

rules.push({
    test: /\.(ttf|png)$/,
    use: [
        {
            loader: "file-loader",
            options: {
                // Fix for assets files (.png, .ttf) not being found when running executable.
                // See https://github.com/electron-userland/electron-forge/issues/1196
                publicPath: ".."
            }
        }
    ]
});

module.exports = {
    module: {
        rules,
    },
    plugins: plugins,
    resolve: {
        alias: {
            src: path.resolve(__dirname, "src/")
        },
        extensions: [".js", ".ts", ".jsx", ".tsx", ".css"]
    },
};
