const fs = require('fs');
const os = require('os');

const _ = require('lodash/fp');

const ORIGIN_FILE = 'test-files/1.txt';
const MUTATED_FILE = 'test-files/2.txt';

const originFile = fs.readFileSync(ORIGIN_FILE, 'utf8');
const mutatedFile = fs.readFileSync(MUTATED_FILE, 'utf8');

const originalFileLines = originFile.split(os.EOL);
const mutatedFileLines = mutatedFile.split(os.EOL);

const getLcsMatrix = (s1, s2) => {
  const lcsMatrix = [];

  for (let i = 0; i <= s1.length; i++) {
    lcsMatrix.push([]);
    for (let j = 0; j <= s2.length; j++) {
      let currValue = 0;

      if (i === 0 || j === 0) currValue = 0;
      else if (s1[i - 1] === s2[j - 1]) currValue = lcsMatrix[i - 1][j - 1] + 1;
      else currValue = Math.max(lcsMatrix[i][j - 1], lcsMatrix[i - 1][j]);

      lcsMatrix[i].push(currValue);
    }
  }

  return lcsMatrix
};

const getLcs = (s1, s2) => {
  const lcsMatrix = getLcsMatrix(s1, s2);
  const s3 = [];
  let i = s1.length;
  let j = s2.length;

  while (lcsMatrix[i][j] > 0) {
    if(s1[i-1] === s2[j-1] && (lcsMatrix[i-1][j-1] + 1 === lcsMatrix[i][j])) {
      s3.push(s1[i-1]);

      i = i-1;
      j = j-1;
    } else if (lcsMatrix[i-1][j] > lcsMatrix[i][j-1])
      i = i-1;
    else
      j = j-1;
  }

  return s3;
}

console.log(getLcs(originalFileLines, mutatedFileLines))