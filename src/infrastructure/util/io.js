/*
 *  Amber Notes
 *
 *  Copyright (C) 2016 - 2019 The Amber Notes Authors
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import * as fs from "fs";

export function directoryExists(pathToDirectory) {
  return new Promise((resolve) => {
    fs.access(pathToDirectory, error => {
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
    fs.mkdir(pathToDirectory, error => {
      if (!error) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
}

export function deleteDirectory(pathToDirectory) {
  return new Promise((resolve, reject) => {
    fs.rmdir(pathToDirectory, error => {
      if (!error) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
}

export function fileExists(pathToFile) {
  return new Promise((resolve) => {
    fs.access(pathToFile, error => {
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
    fs.writeFile(pathToFile, content, options, error => {
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
    fs.unlink(pathToFile, error => {
      if (!error) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
}