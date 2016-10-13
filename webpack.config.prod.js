const config = require("./webpack.config");

config.output.filename = "./dist/[name].entry.js";

module.exports = config;
