const { error } = require('console');
const fs = require('fs');
const path = require('path');

const destinationFolder = path.join(__dirname, 'project-dist');
const components = path.join(__dirname, 'components');
const styles = path.join(__dirname, 'styles');
const assets = path.join(__dirname, 'assets');

(function crateProjectDist() {
  fs.mkdir(destinationFolder,
    { recursive: true },
    (err) => {
      if (err) throw err;
    }
  )
})();

(function createIndexHtml() {
  const input = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');

  let outputHtml = '';

  input.on('data', chunk => outputHtml += chunk);
  input.on('end', () => {
    fs.readdir(components,
      { withFileTypes: true },
      (err, files) => {
        if (err) throw new Error('Can not read component files');
        files.forEach((file) => {
          if (file.isFile() && path.extname(file.name) === '.html') {

            const component = fs.createReadStream(path.join(components, file.name));
            let componentHtml = '';

            component.on('data', chunk => componentHtml += chunk);
            component.on('end', () => {
              outputHtml = outputHtml.replace(`{{${file.name.split('.')[0]}}}`, `${componentHtml}`);
              fs.writeFile(path.join(destinationFolder, 'index.html'),
                outputHtml,
                (err) => {
                  if (err) throw new Error('can not write index.html file');
                }
              )
            })
          }
        })
      }
    )
  })
})();

(function createStyleCss() {

  let bundle = [];

  fs.readdir(styles, (error, files) => {
    if (error) throw error;
    const cssFiles = [];
    let fileProcessed = 0;

    files.forEach(file => {
      if (path.extname(file) === '.css') cssFiles.push(file);
    });

    cssFiles.forEach(file => {
      fs.readFile(path.join(styles, file), (error, data) => {
        if (error) throw error;
        bundle.push(data.toString());
        fileProcessed += 1;
        if (fileProcessed === cssFiles.length) {
          bundle = bundle.join('\n');

          fs.writeFile(
            path.join(destinationFolder, 'style.css'),
            bundle,
            (error) => {
              if (error) throw error;
            });
        };
      });
    });
  });

})();

(function copyAssets() {
  const folderAfterCopy = path.join(destinationFolder, 'assets');

  fs.mkdir(folderAfterCopy, { recursive: true }, (error) => {
    if (error) throw error;
  });

  // remove files in assets
  fs.readdir(folderAfterCopy, (error, folders) => {
    if (error) throw error;
    if (folders) {
      folders.forEach(folder => {
        const folderPath = path.join(folderAfterCopy, folder);

        fs.readdir(folderPath, (error, files) => {
          if (error) throw error;
          files.forEach(file => {
            fs.unlink(path.join(folderPath, file), error => {
              if (error) throw error;
            })
          });
        });

      });
      // folders.forEach(folder => {
      //   const folderPath = path.join(folderAfterCopy, folder);
      //   fs.rmdir(folderPath, (error) => {
      //     if (error);
      //   });
      // });
    }
  })

  // add files in assets
  fs.readdir(assets, (error, folders) => {
    if (error) throw error;
    folders.forEach(folder => {
      const folderPath = path.join(assets, folder);
      fs.mkdir(path.join(folderAfterCopy, folder), { recursive: true }, (error) => {
        if (error) throw error;
      });

      fs.readdir(folderPath, (error, files) => {
        if (error) throw error;

        files.forEach(file => {
          const filePath = path.join(folderPath, file)
          fs.copyFile(
            path.join(filePath),
            path.join(folderAfterCopy, folder, file),
            (err) => {
              if (err) throw err;
            });
        })
      })
    });
  })

})();