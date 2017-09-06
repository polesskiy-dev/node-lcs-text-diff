const fs = require('fs');
const os = require('os');

const gitDiff = require('./diff');

const [mutatedFilePath, originalFilePath] = process.argv.reverse();

if (originalFilePath && mutatedFilePath && fs.existsSync(originalFilePath) && fs.existsSync(mutatedFilePath)) {
  const originFile = fs.readFileSync(originalFilePath, 'utf8');
  const mutatedFile = fs.readFileSync(mutatedFilePath, 'utf8');

  const originalFileLines = originFile.split(os.EOL);
  const mutatedFileLines = mutatedFile.split(os.EOL);

  const diff = gitDiff(originalFileLines, mutatedFileLines);
  const result = diff.map((diffTransformation, index) => `${(index + 1).toString().padEnd(' ', 2)} ${diffTransformation.toString()}`)

  result.forEach(v => console.log(v))
} else {
  console.log('Please, provide existing files!')
}
