/*
This helper function generates an array of file names for the chunks
to be downloaded.

params:
 - 'numberOfchunks' is an integer with 1 as a minimum value.
 - 'extension' is a string extracted from the URL.
 - 'path' is a string inserted by the user.
*/

const partsNames = (numberOfChunks, extension, path) => {
  let fileParts = [];
  for (i = 1; i <= numberOfChunks; i++) {
    fileParts[i - 1] = `${path}/.part${i}${extension}`;
  }
  return fileParts;
};

module.exports = partsNames;
