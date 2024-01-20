const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      fs.stat(path.join(__dirname, 'secret-folder', file), (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        if (stats.isFile()) {
          console.log(
            file.split('.').slice(0, 1).join() +
              ' - ' +
              path.extname(file).split('.').slice(-1).join() +
              ' -',
            (stats.size > 1024 ? (stats.size / 1024).toFixed(3) : stats.size) +
              ' kB',
          );
        }
      });
    });
  }
});
