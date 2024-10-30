var fs = require("fs");
const semver = require("semver");
const { getCurrentVersion } = require("./helpers");

function updatePluginVersion() {
  const version = getCurrentVersion();
  const filesToChange = [
    {
      name: "./README.txt",
      regex: /Stable tag:(\s+)([0-9.]+)/,
      replacement: `Stable tag:$1${version}`
    },
    {
      name: "./index.php",
      regex: /Version:(\s+)([0-9.]+)/,
      replacement: `Version:$1${version}`
    }
  ];
  let matches;
  filesToChange.forEach(function(file) {
    fs.readFile(file.name, "utf8", function(err, data) {
      if (err) {
        return console.log(err);
      }
      matches = data.match(file.regex);
      if (matches && semver.lt(matches[2], version)) {
        var result = data.replace(file.regex, file.replacement);
        fs.writeFile(file.name, result, "utf8", function(err) {
          if (err) return console.log(err);
          addUpdatedFileToGitStaging(file.name);
        });
      }
    });
  });
}

function addUpdatedFileToGitStaging(file) {
  const exec = require("child_process").exec;
  const command = `git add ${file}`;
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.log(stderr);
    }
  });
}

updatePluginVersion();
