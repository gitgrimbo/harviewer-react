/* eslint-env node, shelljs */
const fs = require("fs");
const path = require("path");
require("shelljs/global");

const ghTemp = "./temp/gh-pages/";
const repo = require("../package.json").repository.url;

set("+v");

if (!which("git")) {
  echo("git is required");
  exit(1);
}


// Clean and create the staging folder, ghTemp.

rm("-rf", ghTemp);
mkdir("-p", ghTemp);

if (exec("git clone " + repo + " --branch gh-pages --single-branch " + ghTemp).code !== 0) {
  echo("git clone failed");
  exit(1);
}


// Run the build and copy the built resources to staging

if (exec("npm run build:prod").code !== 0) {
  echo("webpack build failed");
  exit(1);
}

cp("-r", "./dist/*", ghTemp);


// Copy the webapp to staging

cp("-r", "./webapp/*", ghTemp);


// Copy other required node_modules to staging

function copyAndPreserveFolder(dest, folder, file) {
  const src = path.join(folder, file);
  mkdir("-p", path.join(dest, folder));
  cp(src, path.join(dest, folder));
}

copyAndPreserveFolder(ghTemp, "node_modules/jquery/dist", "jquery.js");
copyAndPreserveFolder(ghTemp, "node_modules/urijs/src", "URI.js");


// Fix the path differences between dev and prod.

function fixLinks(file) {
  // When deploying we don't want to move 'out' of the webapp to locate the
  // node_modules folder.
  let str = fs.readFileSync(file, { encoding: "utf-8" });
  str = str.replace("../node_modules/", "node_modules/");
  fs.writeFileSync(file, str);
}

fixLinks(path.join(ghTemp, "index.html"));
fixLinks(path.join(ghTemp, "demos", "demo-shell.html"));

// https://github.com/blog/572-bypassing-jekyll-on-github-pages
touch(path.join(ghTemp, ".nojekyll"));

// Add the staging files to the gh-pages branch

cd(ghTemp);

exec("git add .");
exec("git commit --amend --no-edit");
exec("git push -f origin gh-pages");
