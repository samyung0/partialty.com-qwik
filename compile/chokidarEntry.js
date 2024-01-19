/* eslint-disable */
const chokidar = require("chokidar");

chokidar
  .watch(".", {
    ignored: ["**/node_modules", "**/.git", "**/node_modules/**/*", "**/.git/**/*"],
    cwd: ".", // needed, otherwise chokidar might return absolute path https://github.com/paulmillr/chokidar/issues/918
  })
  .on("all", (event, path) => {
    console.log(event, path);
  });

// compile with @vercel/ncc

// MAKE SURE that the closest package.json does not contain type: module
