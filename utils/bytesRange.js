const bytesRange = chunk => {
  let startByte;
  chunk === 1 ? (startByte = 0) : (startByte = (chunk - 1) * 1023000);

  let endByte = startByte + 1022999;

  return `bytes=${startByte}-${endByte}`;
};

module.exports = bytesRange;
// assuming chunk is an integer with 1 as a minimum value
