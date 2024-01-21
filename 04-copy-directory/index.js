const path = require('path');
const fs = require('fs');

const oldAssets = path.join(__dirname, 'files');
const newAssets = path.join(__dirname, 'files-copy');

fs.readdir(path.join(__dirname), (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      if (path.join(__dirname, file) === path.join(__dirname, 'files-copy')) {
        fs.rm(newAssets, { recursive: true }, (err) => {
          if (err) console.log(err);
          else {
            forCopy(oldAssets, newAssets);
          }
        });
      }
    });
  }
});

async function forCopy(copied, created) {
  try {
    await fs.access(created);
    await fs.rm(created, { recursive: true });
  } catch (err) {}

  await fs.mkdir(newAssets, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
  });

  await fs.readdir(copied, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        fs.stat(copied + `\\${file}`, (err, stats) => {
          if (err) {
            console.error(err);
            return;
          }
          if (stats.isFile()) {
            fs.copyFile(`${copied}\\${file}`, `${created}\\${file}`, (err) => {
              if (err) {
                console.log('Error Found:', err);
              }
            });
          } else if (stats.isDirectory()) {
            fs.mkdir(`${created}\\${file}`, { recursive: true }, (err) => {
              if (err) {
                return console.error(err);
              }
            });

            forCopy(`${copied}\\${file}`, `${created}\\${file}`);
          }
        });
      });
    }
  });
}
forCopy(oldAssets, newAssets);
