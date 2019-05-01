/* inquirer is is the applications entry point as it is responsible for the Cli prompts.
The first part here is an array of questions the user will prompted with in order
for them to interact with the application.

1. When the user inters a URL its pattern will be validated against a regex. Then a HEAD request
will be made to check if the URL supports Ranges, so slight delay will be noticed before
going to the next prompt.

2. The user will be asked for the desired destinaion for the files to be stored in.
it has default value of "./downloads" which will be created in the apps directory.

3. The user will be asked for the number of chunks they wish to download.
NOTE: currently if the number of chunks was bigger than the maximum chunks the file needed
some redundant chunks will be generated with 0 bytes, but will not cause any damage to
the final merged file.

4. finally the "iquirer.prompt()" will resolve with the answers of the user to be pased into
the .then().

".then((answers)=>{
  <YOUR CODE HERE>
})"

Which in our case is the downloader() function.

*/

const inquirer = require("inquirer");
const request = require("request");
const mkdirp = require("mkdirp");
const downloader = require("./models/downloader");
const URL_PATTERN = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;

inquirer
  .prompt([
    {
      type: "input",
      name: "fileURL",
      message: "Insert the URL of the file you want to download:",
      filter(url) {
        return new Promise((resolve, reject) => {
          let pass = url.match(URL_PATTERN);
          if (!pass) {
            reject("Please inseart a valid URL!");
          }
          request
            .head(url)
            .on("error", err => {
              reject(`${err}`);
            })
            .on("response", res => {
              if (res.statusCode !== 200) {
                reject("Unsuccessful request!");
              }
              if (res.headers["accept-ranges"] === "bytes") {
                resolve(url);
              } else {
                reject(
                  "Unfortionately the URL provided does not support ranges."
                );
              }
            });
        });
      }
    },
    {
      type: "input",
      name: "path",
      message:
        "Insert the desired destination for downloaded files 'relative path':",
      validate: path => {
        mkdirp(path, err => {
          if (err) {
            return err;
          }
        });
        return true;
      },
      default: "./downloads"
    },
    {
      type: "number",
      name: "numberOfChunks",
      message: "insert the number of chunks you desire to download:",
      default: 4,
      validate: value => {
        if (Number.isInteger(value)) {
          return true;
        } else {
          return "Please insert an integer!";
        }
      }
    },
    {
      type: "input",
      name: "fileName",
      message: "Insert file name for the downloaded file.",
      default: "final"
    },
    {
      type: "confirm",
      name: "keepFileParts",
      message: "Do you want to keep chunks after merging?",
      default: true
    }
  ])
  .then(answers => {
    downloader(answers);
  })
  .catch(err => {
    throw err;
  });
