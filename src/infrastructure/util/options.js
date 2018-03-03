/*
 *  Amber Notes
 *
 *  Copyright (C) 2016 - 2018 The Amber Notes Authors
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

export default class Options {

  static apply(target, options) {
    if (target && options) {
      for (var propertyName in options) {
        var properyDescriptor = this.getPropertyDescriptor(target, propertyName);
        if (properyDescriptor && properyDescriptor.set) {
          target[propertyName] = options[propertyName];
        }
      }
    }
  }

  static getPropertyDescriptor(target, propertyName) {
    while (target) {
      var properyDescriptor = Object.getOwnPropertyDescriptor(target, propertyName);
      if (properyDescriptor) {
        return properyDescriptor;
      }
      target = Object.getPrototypeOf(target);
    }
    return null;
  }

}