const fs = require('fs');
const path = require('path');
fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        fs.stat(path.join(__dirname, 'files', file), (err, stats) => {
          if (err) {
            console.error(err);
            return;
          }
          if (stats.isFile()) {
            fs.copyFile(
              path.join(__dirname, 'files', file),
              path.join(__dirname, 'files-copy', file),
              (err) => {
                if (err) {
                  console.log('Error Found:', err);
                }
              },
            );
          }
        });
      });
    }
  });
});
