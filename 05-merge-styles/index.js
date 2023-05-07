const { error } = require('console');
const fs = require('fs')
const path = require('path');

const destinationFolder = path.join(__dirname, 'project-dist');
const stylesFolder = path.join(__dirname, 'styles');

let bundle = [];

fs.readdir(stylesFolder, (error, files) => {
  if (error) throw error;
  const cssFiles = [];
  let fileProcessed = 0;

  files.forEach(file => {
    if (path.extname(file) === '.css') cssFiles.push(file);
  });

  cssFiles.forEach(file => {
    fs.readFile(path.join(stylesFolder, file), (error, data) => {
      if (error) throw error;
      bundle.push(data.toString());
      fileProcessed += 1;
      if (fileProcessed === cssFiles.length) {
        bundle = bundle.join('\n');

        fs.writeFile(
          path.join(destinationFolder, 'bundle.css'),
          bundle,
          (error) => {
            if (error) throw error;
          });
      };
    });
  });
});

