/** @satisfies {import('@webcontainer/api').FileSystemTree} */

export default {
  a: {
    directory: {
      "test.js": {
        file: {
          contents: `const fs = require("fs")`,
        },
      },
    },
  },
  "index.js": {
    file: {
      contents: `const express = require('express');
        const app = express();
        const port = 3111;

        app.use(express.static("public"))
        
        app.get('/', (req, res) => {
          console.log("dsajdklsajkdlas")
          res.send('Welcome to a WebContainers app! 🥳');
        });
        
        app.listen(port, () => {
          console.log(\`App is live at http://localhost:\${port}\`);
        });`,
    },
  },
  "package.json": {
    file: {
      contents: `{
          "name": "example-app",
    "dependencies": {
      "express": "latest",
      "nodemon": "latest"
    },
    "scripts": {
      "start": "nodemon --watch './' index.js"
    }
  }`,
    },
  },
};
