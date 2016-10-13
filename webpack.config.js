const webpack = require("webpack");
const path = require("path");
const packageJson = require("./package.json");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// Export some data to the webpack build.  See buildInfo.js.
const gitRevisionPlugin = new GitRevisionPlugin();
const definePlugin = new webpack.DefinePlugin({
  __buildInfo__: {
    version: JSON.stringify(packageJson.version),
    gitVersion: JSON.stringify(gitRevisionPlugin.version()),
    gitCommit: JSON.stringify(gitRevisionPlugin.commithash()),
  },
});

function makeConfig({
  target = "",
  babelPresetEnvUseBuiltIns = false,
}) {
  const babelPresetEnvTargets = (target === "legacy")
    ? {
      "ie": "11",
    }
    : [
      "last 2 versions",
      "not ie < 999",
      "not android < 999",
      "not dead",
    ];

  return {
    mode: "development",
    entry: {
      // polyfill required by (at least) IE11
      main: [
        "whatwg-fetch",
        "./webapp/main.js",
      ],
      demo: [
        "whatwg-fetch",
        "./webapp/demo.js",
      ],
    },
    output: {
      path: path.join(__dirname, "webapp", "dist"),
      publicPath: "/webapp/dist/",
      filename: `[name].${target ? target + "." : ""}js`,
    },
    devtool: "source-map",
    plugins: [
      definePlugin,
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        generateStatsFile: true,
        statsFilename: path.join(__dirname, "reports", (target ? target + "." : "") + "stats.json"),
        analyzerMode: "static",
        reportFilename: path.join(__dirname, "reports", (target ? target + "." : "") + "report.html"),
      }),
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial",
          },
        },
      },
    },
    module: {
      rules: [
        {
          // .js or .jsx
          test: /\.jsx?$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", {
                  useBuiltIns: babelPresetEnvUseBuiltIns,
                  targets: babelPresetEnvTargets,
                  debug: true,
                }],
                "@babel/preset-react",
              ],
              // transform-runtime required for things like Object.assign() for browsers that don't support that.
              // rest-spread transform required for "valuelink"" module
              plugins: [
                "transform-class-properties",
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
            },
          ],
        },
        {
          // inline base64 URLs for <=8k images, direct URLs for the rest
          test: /\.(png|jpg)$/,
          loader: "url-loader?limit=8192",
        },
      ],
    },
    devServer: {
      // Until all the test resources are part of the harviewer-react project,
      // use the original harviewer resources via proxy.
      proxy: {
        "/selenium": "http://harviewer.lan:49001",
      },
    },
    resolveLoader: {
      alias: {
        "i18n": "amdi18n-loader",
      },
    },
  };
}

module.exports = (env, options) => {
  const prod = options && options.mode === "production";
  const babelPresetEnvUseBuiltIns = prod ? "entry" : false;
  return [
    makeConfig({
      babelPresetEnvUseBuiltIns,
    }),
    makeConfig({
      target: "legacy",
      babelPresetEnvUseBuiltIns,
    }),
  ];
};
