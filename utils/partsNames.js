const partsNames = (numberOfChunks, extension, path) => {
  let fileParts = [];
  for (i = 1; i <= numberOfChunks; i++) {
    fileParts[i - 1] = `${path}/.part${i}${extension}`;
  }
  return fileParts;
};

module.exports = partsNames;
