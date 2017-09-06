class DiffTransformation {
  static get INSERT() {
    return '+'
  };

  static get DELETE() {
    return '-'
  };

  static get CHANGE() {
    return '*'
  };

  static get EQUAL() {
    return ' '
  };

  constructor(indexOriginal, indexMutated, action, content) {
    this.indexOriginal = indexOriginal;
    this.indexMutated = indexMutated;
    this.action = action;
    this.content = content;
  }

  toString() {
    return `${this.action} ${this.content}`
  }
}

const getLcsMatrix = (originalLines, mutatedLines) => {
  const lcsMatrix = [];
  let moveLeft, moveDiagonal, moveUp;

  // init lcs matrix
  for (let i = 0; i <= originalLines.length; i++) {
    lcsMatrix.push([]);
    for (let j = 0; j <= mutatedLines.length; j++) {
      if (i === 0) lcsMatrix[i][j] = j;
      else if (j === 0) lcsMatrix[i][j] = i;
      else lcsMatrix[i][j] = 0;
    }
  }

  // fill lcs matrix
  for (let i = 1; i <= originalLines.length; i++) {
    for (let j = 1; j <= mutatedLines.length; j++) {
      moveLeft = lcsMatrix[i][j - 1];
      moveDiagonal = lcsMatrix[i - 1][j - 1];
      moveUp = lcsMatrix[i - 1][j];

      lcsMatrix[i][j] = (originalLines[i - 1] === mutatedLines[j - 1])
        ? moveDiagonal
        : Math.min(moveLeft, moveDiagonal, moveUp) + 1
    }
  }

  return lcsMatrix;
};

const getDiff = (originalLines, mutatedLines) => {
  const lcsMatrix = getLcsMatrix(originalLines, mutatedLines);

  let i = originalLines.length;
  let j = mutatedLines.length;
  let diff = [];
  let moveLeft, moveDiagonal, moveUp;

  while (i !== 0 && j !== 0) {
    if (originalLines[i - 1] === mutatedLines[j - 1]) {
      diff.push(new DiffTransformation(i, j, DiffTransformation.EQUAL, originalLines[i - 1]));
      i--;
      j--;
    } else {
      if (i - 1 >= 0) moveUp = lcsMatrix[i - 1][j];
      if (j - 1 >= 0) moveLeft = lcsMatrix[i][j - 1];
      if (i - 1 >= 0 && j - 1 >= 0) moveDiagonal = lcsMatrix[i - 1][j - 1];

      switch (Math.min(moveLeft, moveUp, moveDiagonal)) {
        case moveLeft:
          diff.push(new DiffTransformation(i, j, DiffTransformation.INSERT, mutatedLines[j - 1]));
          j--;
          break;
        case moveUp:
          diff.push(new DiffTransformation(i, j, DiffTransformation.DELETE, originalLines[i - 1]));
          i--;
          break;
        case moveDiagonal:
          diff.push(new DiffTransformation(i, j, DiffTransformation.CHANGE, `${originalLines[i - 1]} | ${mutatedLines[j - 1]}`));
          i--;
          j--;
          break;
      }
    }
  }

  return diff.reverse()
};

module.exports = getDiff;