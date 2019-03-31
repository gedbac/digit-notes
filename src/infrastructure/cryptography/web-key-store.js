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

import KeyStore from "./key-store";

export default class WebKeyStore extends KeyStore {

  constructor(encryptionService, logger) {
    super(encryptionService, logger);
  }

  async load(password) {
    try {
      if (!password) {
        throw new Error("Password is null");
      }
      var { chippertext, iv } = JSON.parse(localStorage.getItem("KEY_STORE_DATA"));
      var privateKey = await this._encryptionService.computeHash(password);
      var data = await this._encryptionService.decrypt(chippertext, iv, privateKey);
      if (data && "secrets" in data) {
        this._secrets = new Map(data.secrets);
      } else {
        this._secrets = new Map();
      }
      this.logger.logDebug("Keys has been loadded");
    } catch(error) {
      this.logger.logError(`Failed to load keys\n${error}`);
      throw error;
    }
  }

  async store(password) {
    try {
      if (!password) {
        throw new Error("Password is null");
      }
      var data = {
        secrets: [...this._secrets]
      };
      var privateKey = await this._encryptionService.computeHash(password);
      var { chippertext, iv } = await this._encryptionService.encrypt(data, privateKey);
      localStorage.setItem("KEY_STORE_DATA", JSON.stringify({
        chippertext: chippertext,
        iv: iv
      }));
      this.logger.logDebug("Keys has been stored");
    } catch(error) {
      this.logger.logError(`Failed store to store keys\n${error}`);
      throw error;
    }
  }

  _toBase64(data) {
    return btoa(
      new Uint8Array(data)
        .reduce((base64, byte) => base64 + String.fromCharCode(byte), "")
    );
  }

}