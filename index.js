const fs = require('fs');
const os = require('os');
const _ = require('lodash/fp');

const getLcs  = require('./lcs');

const ORIGIN_FILE = 'test-files/1.txt';
const MUTATED_FILE = 'test-files/2.txt';
const PRETTY_SEPARATOR = '_';
const PRETTY_LENGTH = 25;

const originFile = fs.readFileSync(ORIGIN_FILE, 'utf8');
const mutatedFile = fs.readFileSync(MUTATED_FILE, 'utf8');

const originalFileLines = /*'ADFGT'.split('')*/originFile.split(os.EOL);
const mutatedFileLines = /*'AFOXT'.split('')*/mutatedFile.split(os.EOL);

const lcs = getLcs(originalFileLines, mutatedFileLines);

for (let i = 0; i < originalFileLines.length; i++) {
  const original = originalFileLines[i].padEnd(PRETTY_LENGTH, PRETTY_SEPARATOR);
  const diff = lcs[i].padEnd(PRETTY_LENGTH, PRETTY_SEPARATOR);
  const mutated = mutatedFileLines[i].padEnd(PRETTY_LENGTH, PRETTY_SEPARATOR);

  // console.log(i, original, diff, mutated)
}

// console.log(lcs)