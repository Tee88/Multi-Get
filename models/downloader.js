/* The downloader function is responsible for making the GET requests
to download the file chunks and finally merge them into a single file
with the correct extension.

Through the for-loop the function will trigger asynchronous HTTP request
for each chunk. The chunks will be downloaded in prallel due to Node.js's asynchronous
behaviour. The chunk files will be hidden (prefixed with '.').

After the chunks are successfully downloaded they will merged into a single
file with name 'final'.

If the user chooses to delete the chunks after merging (from initial prompt)
the files will be deleted hence saving storage space.


Assumptions:
  - The file extension will always be included at the end of the URL.

*/

const fs = require("fs");
const request = require("request");
const concat = require("concat-files");
const getBytesRange = require("../utils/getBytesRange");
const getPartsNames = require("../utils/partsNames");
const EXTENSION_PATTERN = /\.[0-9a-z]+$/i;

const downloader = answers => {
  const url = answers.fileURL;
  const path = answers.path;
  const numberOfChunks = answers.numberOfChunks;
  const keepFileParts = answers.keepFileParts;

  const extension = url.match(EXTENSION_PATTERN)[0];

  let counter = 0;
  for (i = 1; i <= numberOfChunks; i++) {
    const file = fs.createWriteStream(`${path}/.part${i}${extension}`);
    const options = {
      url: url,
      headers: {
        Range: getBytesRange(i)
      }
    };

    request
      .get(options, err => {
        if (err) throw err;
      })
      .on("data", data => {
        file.write(data);
      })
      .on("complete", res => {
        file.end();
        counter++;

        const partsNames = getPartsNames(numberOfChunks, extension, path);

        console.log(`${counter} chunks out of ${numberOfChunks} complete.`);
        console.log(res.headers["content-range"]);
        console.log("/////////////");

        if (counter === numberOfChunks) {
          console.log("All chunks recieved");
          console.log("Merging.....");

          concat(partsNames, `${path}/final${extension}`, err => {
            if (err) throw err;
            console.log("Merging parts successfully completed!");
            if (!keepFileParts) {
              console.log("Cleaning up....");
              partsNames.map(part => {
                fs.unlink(`${part}`, err => {
                  if (err) throw err;
                });
              });
              console.log(`File parts successfully cleaned!`);
            } else {
              return;
            }
          });
        }
      });
  }
};

module.exports = downloader;
