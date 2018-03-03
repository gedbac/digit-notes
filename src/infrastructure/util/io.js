import * as fs from "fs";

export function directoryExists(pathToDirectory) {
  return new Promise((resolve, reject) => {
    fs.access(pathToDirectory, (error) => {
      if (!error) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

export function createDirectory(pathToDirectory) {
  return new Promise((resolve, reject) => {
    fs.mkdir(pathToDirectory, (error) => {
      if (!error) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
}

export function fileExists(pathToFile) {
  return new Promise((resolve, reject) => {
    fs.access(pathToFile, (error) => {
      if (!error) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

export function readFile(pathToFile, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathToFile, options, (error, content) => {
      if (!error) {
        resolve(content);
      } else {
        reject(error);
      }
    });
  });
}

export function writeFile(pathToFile, options, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(pathToFile, content, options, (error) => {
      if (!error) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
}

export function deleteFile(pathToFile) {
  return new Promise((resolve, reject) => {
    fs.unlink(pathToFile, (error) => {
      if (!error) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
}