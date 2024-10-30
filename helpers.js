const fs = require("fs");

function config(key, defaultValue = null) {
  const rawdata = fs.readFileSync("./plugin.config.json");
  const config = JSON.parse(rawdata);
  return config[key] || defaultValue;
}

function getCurrentVersion() {
  return config("version");
}

module.exports = {
  config,
  getCurrentVersion
};
