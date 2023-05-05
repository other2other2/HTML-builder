const { stdout, stdin } = process;
const path = require('path');
const fs = require('fs');

process.on('exit', () => stdout.write('your thoughts has been added'));
process.on('SIGINT', () => process.exit());

fs.writeFile(
  path.join(__dirname, 'note.txt'),
  '',
  (error) => {
    if (error) throw error;
  });

stdout.write('Hi, there you can enter your thoughts:\n');
stdin.on('data', (data) => {
  data = data.toString();
  if (data.trim() === 'exit') process.exit();
  fs.appendFile(
    path.join(__dirname, 'note.txt'),
    `- ${data}`,
    (error) => {
      if (error) throw error;
    }
  )
});
