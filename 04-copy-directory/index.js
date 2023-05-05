const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const folderToCopy = path.join(__dirname, 'files');
const folderAfterCopy = path.join(__dirname, 'files-copy');

fs.mkdir(folderAfterCopy, { recursive: true }, (error) => {
  if (error) throw error;
});

// ignore the different syntax of these two "readdir" i just try to use different ways to apply it
fs.readdir(folderAfterCopy, (error, files) => {
  if (error) throw error;

  files.forEach(file => {
    fs.unlink(path.join(folderAfterCopy, file), error => {
      if (error) throw error;
    })
  });
})

readdir(folderToCopy)
  .then((files) => {
    files.forEach(file => {
      fs.copyFile(
        path.join(folderToCopy, file),
        path.join(folderAfterCopy, file),
        (err) => {
          if (err) throw err;
        });
    });
  })
  .catch((error) => {
    console.error(error);
  })