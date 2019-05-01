// const url = "https://sample-videos.com/img/Sample-jpg-image-5mb.jpg";
// const url = "http://f39bf6aa.bwtest-aws.pravala.com/384MB.jar";

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
