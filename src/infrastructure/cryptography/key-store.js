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

  constructor(encryptionService, logger) {
    if (new.target === KeyStore) {
      throw new Error("Can't construct abstract instances directly");
    }
    this._encryptionService = encryptionService;
    if (!this._encryptionService) {
      throw new Error("Encryption service is null");
    }
    this._logger = logger;
    if (!this._logger) {
      throw new Error("Logger is null");
    }
    this._secrets = new Map();
  }

  get logger() {
    return this._logger;
  }

  async load(password) {
    throw new Error("Method 'load' is not implemented");
  }

  async store(password) {
    throw new Error("Method 'store' is not implemented");
  }

  async getSecret(name) {
    var secret = null;
    try {
      if (!name) {
        throw new Error("Name is null");
      }
      secret = this._secrets.get(name);
      this.logger.logDebug(`Secret has been fetched [name=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to get secret\n${error}`);
      throw error;
    }
    return secret;
  }

  async addSecret(name, value) {
    try {
      if (!name) {
        throw new Error("Name is null");
      }
      if (!value) {
        throw new Error("Value is null");
      }
      this._secrets.set(name, value);
      this.logger.logDebug(`Secret has been added [name=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to add secret\n${error}`);
      throw error;
    }
  }

  async deleteSecret(name) {
    try {
      if (!name) {
        throw new Error("Name is null");
      }
      this._secrets.delete(name);
      this.logger.logDebug(`Secret has been deleted [name=${name}]`);
    } catch(error) {
      this.logger.logError(`Failed to delete secret\n${error}`);
      throw error;
    }
  }

}