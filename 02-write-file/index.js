const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, '/text.txt'));
stdout.write('Enter your data: \n');
stdin.on('data', (chunk) => {
  if (chunk.toString().includes('exit')) {
    process.exit();
  } else {
    output.write(chunk);
  }
});
process.on('exit', () => stdout.write('Good luck'));
process.on('SIGINT', () => process.exit());
