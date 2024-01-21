const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const index = path.join(__dirname, 'project-dist', 'index.html');

const style = path.join(__dirname, 'project-dist', 'style.css');
const oldAssets = path.join(__dirname, 'assets');
const newAssets = path.join(__dirname, 'project-dist', 'assets');

fs.mkdir(projectDist, { recursive: true, force: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});

/* HTML */

let template = '';
let components = [];
let result = '';

const readableStreamTemplate = fs.createReadStream(templatePath, 'utf-8');
readableStreamTemplate.on('data', (chunk) => (template += chunk));
readableStreamTemplate.on('end', () => {
  result = template;
  fs.readdir(path.join(__dirname, 'components'), (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        if (path.extname(file).split('.').slice(-1).join().includes('html')) {
          components.push(file);
        }
      });
    }

    components.forEach((component) => {
      let data = '';
      fs.createReadStream(
        path.join(__dirname, 'components', component),
        'utf-8',
      ).on('data', (chunk) => {
        data += chunk;
        result = result.replace(
          `{{${component.split('.').slice(0, 1).join()}}}`,
          data,
        );
        if (components[components.length - 1] == component) {
          fs.createWriteStream(index).write(result);
        }
      });
    });
  });
});

/* CSS */

const bundle = fs.createWriteStream(style);

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

fs.readdir(path.join(__dirname), (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      if (path.join(__dirname, file) === path.join(__dirname, 'project-dist')) {
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

/* ASSETS */

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
