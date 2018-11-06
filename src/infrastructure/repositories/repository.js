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

export default class Repository {

  constructor(props) {
    if (new.target === Repository) {
      throw new Error("Can't construct abstract instances directly");
    }
  }

  findBy(id) {
    throw new Error("Method 'findBy' is not implemented");
  }

  save(aggregate) {
    throw new Error("Method 'save' is not implemented");
  }

  update(aggregate) {
    throw new Error("Method 'update' is not implemented");
  }

  delete(id) {
    throw new Error("Method 'delete' is not implemented");
  }

}