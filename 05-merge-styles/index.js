const fs = require('fs');
const path = require('path');

const bundle = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      fs.stat(path.join(__dirname, 'styles', file), (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        if (stats.isFile() && path.extname(file).includes('.css')) {
          const input = fs.createReadStream(
            path.join(__dirname, 'styles', file),
            'utf-8',
          );
          input.pipe(bundle);
        }
      });
    });
  }
});
