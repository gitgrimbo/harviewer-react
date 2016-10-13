const webpack = require("webpack");
const path = require("path");
const packageJson = require("./package.json");
const GitRevisionPlugin = require("git-revision-webpack-plugin");

// Path to existing HAR Viewer. We can reuse some code from the following modules:
//   "core", "nls", "preview", "tabs", "syntax-highlighter"
const pathToLegacyHarViewerScripts = path.join(__dirname, "../harviewer2/webapp/scripts");

function addPrefixAndResolve(prefix) {
    return name => {
        // Because we're using modules located outside the project (in
        // original HAR Viewer project), we need to use require.resolve()
        return require.resolve(prefix + name);
    };
}

// Export some data to the webpack build.  See buildInfo.js.
const gitRevisionPlugin = new GitRevisionPlugin();
const definePlugin = new webpack.DefinePlugin({
    __buildInfo__: {
        version: JSON.stringify(packageJson.version),
        gitVersion: JSON.stringify(gitRevisionPlugin.version()),
        gitCommit: JSON.stringify(gitRevisionPlugin.commithash())
    }
});

module.exports = {
    context: path.join(__dirname, "webapp"),
    entry: {
        main: "./main.js",
        demo: "./demo.js"
    },
    output: {
        filename: "./webapp/[name].entry.js"
    },
    plugins: [
        definePlugin
    ],
    module: {
        loaders: [
            {
                // .js or .jsx
                test: /\.jsx?$/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015", "react"].map(addPrefixAndResolve("babel-preset-")),
                    // transform-runtime required for things like Object.assign() for browsers that don't support that.
                    // rest-spread transform required for "valuelink"" module
                    plugins: ["transform-object-assign", "transform-object-rest-spread"].map(addPrefixAndResolve("babel-plugin-"))
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                // inline base64 URLs for <=8k images, direct URLs for the rest
                test: /\.(png|jpg)$/,
                loader: "url-loader?limit=8192"
            }
        ]
    },
    resolve: {
        alias: {
            "core": path.join(pathToLegacyHarViewerScripts, "core"),
            "nls": path.join(pathToLegacyHarViewerScripts, "nls"),
            "preview": path.join(pathToLegacyHarViewerScripts, "preview"),
            "tabs": path.join(pathToLegacyHarViewerScripts, "tabs"),
            "syntax-highlighter": path.join(pathToLegacyHarViewerScripts, "syntax-highlighter")
        }
    },
    resolveLoader: {
        // Because we're using modules located outside the project,
        // we need to lock down the resolverLoader root.
        root: path.join(__dirname, "node_modules"),
        alias: {
            i18n: "amdi18n"
        }
    }
};
