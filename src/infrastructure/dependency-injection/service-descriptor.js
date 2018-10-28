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

  constructor(props) {
    this._name = null;
    if (props && "name" in props) {
      this._name = props.name;
    }
    this._lifetime = null;
    if (props && "lifetime" in props) {
      this._lifetime = props.lifetime;
    }
    this._instance = null;
    if (props && "instance" in props) {
      this._instance = props.instance;
    }
    this._type = null;
    if (props && "type" in props) {
      this._type = props.type;
    }
    this._factory = null;
    if (props && "factory" in props) {
      this._factory = props.factory;
    }
  }
  get name() {
    return this._name;
  }

  get lifetime() {
    return this._lifetime;
  }

  get instance() {
    return this._instance;
  }

  get type() {
    return this._type;
  }

  get factory() {
    return this._factory;
  }

}