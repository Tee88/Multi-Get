/*
This helper function assignes the range of bytes for each request.
Assumptions:
 - 'chunk' is an integer with 1 as a minimum value.
 - each chunk is 1MB in size.
*/

const getBytesRange = chunk => {
  let startByte;
  chunk === 1 ? (startByte = 0) : (startByte = (chunk - 1) * 1023000);

  let endByte = startByte + 1022999;

  return `bytes=${startByte}-${endByte}`;
};

module.exports = getBytesRange;
