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

export default class ServiceDescriptor {

  constructor(name, lifetime, type, factory, instance) {
    this._name = name;
    this._lifetime = lifetime;
    this._type = type;
    this._factory = factory;
    this._instance = instance;
  }

  get name() {
    return this._name;
  }

  get lifetime() {
    return this._lifetime;
  }

  get type() {
    return this._type;
  }

  get factory() {
    return this._factory;
  }

  get instance() {
    return this._instance;
  }

}