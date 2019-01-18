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

import TextSearchResult from "./text-search-result";
import TextIndex from "./text-index";

export default class TextSearch {

  constructor(logger) {
    this._indexes = new Map();
    this._logger = logger;
    if (!this._logger) {
      throw new Error("logger is null");
    }
  }

  createIndex(indexName, options = {}) {
    try {
      if (!indexName) {
        throw new Error("Index's name is null");
      }
      var { propertyName, analyzer, map } = options;
      this._indexes.set(indexName, new TextIndex(propertyName, analyzer, map));
      if (this._logger) {
        this._logger.logInformation(`Index has been created [indexName=${indexName}]`);
      }
    } catch(ex) {
      if (this._logger) {
        this._logger.logError(`Failed to create index [indexName=${indexName}]`);
      }
      throw ex;
    }
  }

  deleteIndex(indexName) {
    try {
      if (!indexName) {
        throw new Error("Index's name is null");
      }
      if (this._indexes.has(indexName)) {
        this._indexes.delete(indexName);
      }
      if (this._logger) {
        this._logger.logInformation(`Index has been deleted [indexName=${indexName}]`);
      }
    } catch(ex) {
      if (this.logger) {
        this.logger.logError(`Failed to delete index [indexName=${indexName}]`);
      }
      throw ex;
    }
  }

  put(indexName, document) {
    try {
      if (!indexName) {
        throw new Error("Index's name is null");
      }
      if (this._indexes.has(indexName)) {
        var index = this._indexes.get(indexName);
        index.put(document);
        if (this._logger) {
          this._logger.logDebug(`Document has been added to index [indexName=${indexName}]`);
        }
      } else {
        throw new Error(`Index '${indexName}' not found`);
      }
    } catch(ex) {
      if (this.logger) {
        this.logger.logError(`Failed to put document to index [indexName=${indexName}]`);
      }
      throw ex;
    }
  }

  search(indexName, keyword) {
    try {
      if (!indexName) {
        throw new Error("Index's name is null");
      }
      var result = null;
      if (this._indexes.has(indexName)) {
        var index = this._indexes.get(indexName);
        var start = Date.now();
        var hits = index.find(keyword);
        var end = Date.now();
        var took = end - start;
        result = new TextSearchResult(hits, took);
        if (this._logger) {
          this._logger.logInformation(`Text search has been completed ` +
            `[indexName=${indexName}, keyword=${keyword}, took=${result.took}]`);
        }
      } else {
        throw new Error(`Index '${indexName}' not found`);
      }
    } catch (ex) {
      if (this._logger) {
        this._logger.logError(`Text search has failed [indexName=${indexName}, keyword=${keyword}]`);
      }
      throw ex;
    }
    return result;
  }

}