# Multi-Get

An application that downloads part of a file from a web server, in chunks.

## Usage

Clone this repo to your local machine and run `npm install` then launch the CLI tool by running `npm start`.

## Suported Features

- Source URL is specified with a required command-line option.
- Checking if the URL supports range requests before proceeding.
- File is downloaded in parallel.
- Configurable number of chunks.
- Each chunk is 1MB.
- Only the first chunks of the file are downloaded from the server.
- Output directory and file name may be specified with a command-line option.
- File is retrieved with GET requests.
