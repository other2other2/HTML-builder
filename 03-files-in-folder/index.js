const { readdir } = require('fs/promises');
const { stdout } = process;
const path = require('path');
const fs = require('fs');


readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true })
  .then((files) => {
    files.forEach(file => {
      if (file.isFile()) {
        fs.stat(path.join(__dirname, 'secret-folder', file.name), (error, stats) => {
          if (error) {
            console.error(error);
            return;
          }
          const fileName = file.name.split('.')[0];
          const fileExt = file.name.slice(file.name.indexOf('.') + 1);
          stdout.write(`${fileName} - ${fileExt} - ${(stats.size / 1024).toFixed(3)}kb\n`)
        })
      }
    });
  })
  .catch((error) => {
    console.error(error);
  })