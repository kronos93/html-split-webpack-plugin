# Commands for test

```bash
  ./node_modules/.bin/webpack --config ./example/webpack/webpack.config.js
  ./node_modules/.bin/webpack-dev-server --config ./example/webpack/webpack.config.js
  node example/favicon
```

# Notes

## Create a file with nodejs

```node
   const fs = require('fs');
    fs.writeFile(s.name, newContents.toString(), err => {
      if (err) return console.log(err);
      console.log('Wrote Hello World in file helloworld.txt, just check it');
    });
```
