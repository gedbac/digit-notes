/*
 *  Digit Notes
 *
 *  Copyright (C) 2016 - 2019 The Digit Notes Authors
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

export default class ObjectSerializer {

  constructor(supportedTypes = new Map()) {
    if (supportedTypes instanceof Array) {
      this._supportedTypes = new Map(supportedTypes);
    } else {
      this._supportedTypes = supportedTypes;
    }
  }

  get supportedTypes() {
    return this._supportedTypes;
  }

  serialize(obj) {
    if (!obj) {
      throw new Error("Object is null");
    }
    var typeName = obj.constructor.name;
    var type = this._supportedTypes.get(typeName);
    if (type) {
      if (!(obj instanceof type)) {
        throw new Error("Type of object is invalid");
      }
      obj = this._cloneObject(obj);
      obj["_t"] = typeName;
    }
    return JSON.stringify(obj);
  }

  deserialize(text) {
    if (!text) {
      throw new Error("Text is null");
    }
    var obj = JSON.parse(text);
    var typeName = obj["_t"];
    if (typeName) {
      var type = this._supportedTypes.get(typeName);
      if (!type) {
        throw new Error(`Type '${typeName}' is not supported`);
      }
      obj = new type(obj);
    }
    return obj;
  }

  _cloneValue(value) {
    if (value instanceof Array) {
      return this._cloneArray(value);
    } else if (typeof value === "object") {
      return this._cloneObject(value);
    }
    return value;
  }

  _cloneArray(array) {
    return array.map(x => this._cloneValue(x));
  }

  _cloneObject(obj) {
    var copy = {};
    var propertyNames = this._getPropertyNames(obj);
    if (propertyNames) {
      for (var propertyName of propertyNames) {
        copy[propertyName] = this._cloneValue(obj[propertyName]);
      }
    }
    return copy;
  }

  _getPropertyNames(obj) {
    var propertyNames = [];
    while (obj && obj !== Object.prototype) {
      obj = Object.getPrototypeOf(obj);
      if (obj && obj !== Object.prototype) {
        var ownPropertyNames = Object.getOwnPropertyNames(obj);
        for (var propertyName of ownPropertyNames) {
          var propertyDescriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
          if (propertyDescriptor.get) {
            propertyNames.push(propertyName);
          }
        }
      }
    }
    return propertyNames;
  }

}