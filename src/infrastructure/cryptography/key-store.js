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

export default class KeyStore {

  constructor(logger) {
    if (new.target === KeyStore) {
      throw new Error("Can't construct abstract instances directly");
    }
    this._logger = logger;
    if (!this._logger) {
      throw new Error("Logger is null");
    }
    this._closed = true;
    this._loaded = false;
  }

  get logger() {
    return this._logger;
  }

  get closed() {
    return this._closed;
  }

  get loaded() {
    return this._loaded;
  }

  async open() {
    this._closed = false;
  }

  async close() {
    this._closed = true;
  }

  async load(password) {
    throw new Error("Method 'load' is not implemented");
  }

  async store(password) {
    throw new Error("Method 'store' is not implemented");
  }

  async getSecret(name) {
    throw new Error("Method 'getSecret' is not implemented");
  }

  async addSecret(name, value) {
    throw new Error("Method 'addSecret' is not implemented");
  }

  async deleteSecret(name) {
    throw new Error("Method 'name' is not implemented");
  }

}