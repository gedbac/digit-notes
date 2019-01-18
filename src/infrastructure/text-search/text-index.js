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

export default class TextIndex {

  constructor(propertyName, analyzer, map = null, data = new Map()) {
    this._propertyName = propertyName;
    if (!this._propertyName) {
      throw new Error("Property name is null");
    }
    this._analyzer = analyzer;
    if (!this._analyzer) {
      throw new Error("Analyzer is null");
    }
    this._map = map;
    if (data instanceof Array) {
      this._data = new Map(data);
    } else {
      this._data = data;
    }
  }

  get propertyName() {
    return this._propertyName;
  }

  get analyzer() {
    return this._analyzer;
  }

  get map() {
    return this._map;
  }

  put(document) {
    if (!document) {
      throw new Error("Document is null");
    }
    if (document && this.propertyName && this.propertyName in document) {
      var propertyValue = document[this.propertyName];
      if (propertyValue) {
        var terms = this.analyzer.analyze(propertyValue);
        if (terms && terms.length > 0) {
          for (var term of terms) {
            var value = document;
            if (this._map) {
              value = this._map(document);
            }
            if (this._data.has(term)) {
              this._data.get(term).push(value);
            } else {
              this._data.set(term, [ value ]);
            }
          }
        }
      }
    }
  }

  find(term) {
    if (term) {
      term = term.toLowerCase();
      if (this._data.has(term)) {
        return this._data.get(term);
      }
    }
    return null;
  }

}