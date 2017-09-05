const _ = require('lodash/fp');

class DiffTransformation {
  static get INSERT(){ return 'INSERT' };
  static get DELETE(){ return 'DELETE' };
  static get CHANGE(){ return 'CHANGE' };
  static get EQUAL(){ return 'EQUAL'};

  constructor(index, indexMutated, action, content) {
    this.index = index;
    this.indexMutated = indexMutated;
    this.action = action;
    this.content = content;
  }

  toString() {
    return `${this.index.toString().padEnd(' ', 3)} ${this.indexMutated.toString().padEnd(' ', 3)} | ${this.action} "${this.content}"`
  }
}

class Diff {
  constructor() {
    this.diffStack = []
  }

  push(diffTransformation) {
    this.diffStack.push(diffTransformation)
  }

  splitToDeleteInsertSequences() {
    const _deleteInsertSequences = [[]];

    for (let i = 0; i < this.diffStack.length; i++) {
      switch (this.diffStack[i].action) {
        case DiffTransformation.EQUAL:
          _deleteInsertSequences.push([]);
          break;
        case DiffTransformation.DELETE:
        case DiffTransformation.INSERT:
          _deleteInsertSequences[_deleteInsertSequences.length - 1].push(this.diffStack[i]);
          break;
      }
    }

    return _deleteInsertSequences
  }

  getChanges() {
    const changesCandidates = this.splitToDeleteInsertSequences()
      .filter(sequence =>
        sequence.find(diffTransformation => diffTransformation.action === DiffTransformation.INSERT) && sequence.find(diffTransformation => diffTransformation.action === DiffTransformation.DELETE))

    return _.flattenDeep(changesCandidates.map(changesCandidate => {
      let inserts = changesCandidate.filter(diffTransformation => diffTransformation.action === DiffTransformation.INSERT);
      let deletes = changesCandidate.filter(diffTransformation => diffTransformation.action === DiffTransformation.DELETE);

      if (deletes.length > inserts.length) deletes = deletes.slice(deletes.length - inserts.length, deletes.length);
      if (inserts.length > deletes.length) inserts = inserts.slice(inserts.length - deletes.length, inserts.length);

      const changes = deletes.map((deleteDiffTransformation, index) => new DiffTransformation(deleteDiffTransformation.index, inserts[index].indexMutated, DiffTransformation.CHANGE, `${deleteDiffTransformation.content} | ${inserts[index].content}`));

      return changes
    }))
  }

   replaceInsertDeleteByAppropriateChanges(changes) {
      // remove insert, delete diffActions duplicated by change diffActions
     changes.forEach(changeDiffTransformation => {
       console.log(_.findIndex(diffTransformation => (diffTransformation.index === changeDiffTransformation.index && diffTransformation.action === DiffTransformation.DELETE))(this.diffStack))
       console.log(_.findIndex(diffTransformation => (diffTransformation.indexMutated === changeDiffTransformation.indexMutated && diffTransformation.action === DiffTransformation.INSERT))(this.diffStack))
       //this.diffStack.filter(diffTransformation => !(diffTransformation.index === changeDiffTransformation.index && diffTransformation.action === DiffTransformation.DELETE) && !(diffTransformation.indexMutated === changeDiffTransformation.indexMutated && diffTransformation.action === DiffTransformation.INSERT))
     })
   }

  toString() {
    //console.log(this.getChanges().map(v => v.toString()));
    this.replaceInsertDeleteByAppropriateChanges(this.getChanges())

    return this.diffStack.map(v=>v.toString())
  }
}

const _getLcsMatrix = (s1, s2) => {
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
  const lcsMatrix = _getLcsMatrix(s1, s2);
  const lcs = s1.map((line, index) => '');
  let i = s1.length;
  let j = s2.length;

  while (lcsMatrix[i][j] > 0) {
    if (s1[i - 1] === s2[j - 1] && (lcsMatrix[i - 1][j - 1] + 1 === lcsMatrix[i][j])) {
      lcs[i - 1] = s1[i - 1];

      i = i - 1;
      j = j - 1;
    } else if (lcsMatrix[i - 1][j] > lcsMatrix[i][j - 1])
      i = i - 1;
    else
      j = j - 1;
  }

  console.log(getDiff(s1, s2).toString())

  return lcs;
};

const getDiff = (arr1, arr2) => {
  const s1 = ['', ...arr1]
  const s2 = ['', ...arr2]
  const lcsMatrix = _getLcsMatrix(s1, s2);
  const diff = new Diff();
  let i = s1.length;
  let j = s2.length;

  while (i !== 0 && j !== 0) {
    if (i === 0 || lcsMatrix[i][j] === lcsMatrix[i][j - 1]) {
      diff.push(new DiffTransformation(i, j, DiffTransformation.INSERT, s2[j - 1]));

      j--;
    } else if (j === 0 || lcsMatrix[i][j] === lcsMatrix[i - 1][j]) {
      diff.push(new DiffTransformation(i, j, DiffTransformation.DELETE, s1[i - 1]));

      i--;
    }  else if (s1[i - 1] === s2[j - 1]) {
      diff.push(new DiffTransformation(i, j, DiffTransformation.EQUAL, s1[i - 1]));

      i--;
      j--;
    }
  }

  return diff
};

module.exports = getLcs;