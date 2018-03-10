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

import { EventSourcedAggregate } from "amber-notes-infrastructure-model";
import {
  OutlineDocumentTitleChanged,
  OutlineDocumentDeleted,
  OutlineAdded,
  OutlineRemoved
} from "amber-notes-outlines-events";
import Outline from "./outline";

export default class OutlineDocument extends EventSourcedAggregate {

  constructor(props) {
    super(props);
    this._title = null;
    if (props && "title" in props) {
      this._title = props.title;
    }
    this._children = [];
    if (props && "children" in props) {
      this._children = props.children.map(x => {
        x.aggregateRoot = this;
        return new Outline(x);
      });
    }
  }

  get title() {
    return this._title;
  }

  set title(value) {
    if (this._title !== value) {
      this.raise(new OutlineDocumentTitleChanged({
        outlineDocumentId: this.id,
        outlineDocumentTitle: value
      }));
    }
  }

  get children() {
    return this._children.slice();
  }

  addOutline(id, text) {
    if (!id) {
      throw {
        message: "Outline's id is null"
      };
    }
    this.raise(new OutlineAdded({
      outlineDocumentId: this.id,
      parentOutlineId: null,
      outlineId: id,
      outlineText: text
    }));
  }

  removeOutline(id) {
    if (!id) {
      throw {
        message: "Outline's id is null"
      };
    }
    this.raise(new OutlineRemoved({
      outlineDocumentId: this.id,
      parentOutlineId: null,
      outlineId: id
    }));
  }

  delete() {
    if (!this.deleted) {
      this.raise(new OutlineDocumentDeleted({
        outlineDocumentId: this.id
      }));
    }
  }

  findOutlineBy(id) {
    return this._children.find(x => x.id === id);
  }

  hasOutline(id) {
    return !!this.findOutlineBy(id);
  }

  toJSON() {
    var json = super.toJSON();
    if (this._title) {
      json.title = this._title;
    }
    if (this._children && this._children.length > 0) {
      json.children = this._children.map(x => x.toJSON());
    }
    return json;
  }

  _applyOutlineEvent(event) {
    var outline = this.findOutlineBy(event.outlineId);
    if (outline) {
      outline.apply(event);
    }
  }

  _onOutlineDocumentCreated(event) {
    this._id = event.outlineDocumentId;
    this._createdOn = event.timestamp;
  }

  _onOutlineDocumentDeleted(event) {
    this._deleted = true;
  }

  _onOutlineDocumentTitleChanged(event) {
    this._title = event.outlineDocumentTitle;
  }

  _onOutlineAdded(event) {
    if (!event.parentOutlineId) {
      if (!this.hasOutline(event.outlineId)) {
        this._children.push(new Outline({
          id: event.outlineId,
          aggregateRoot: this,
          text: event.outlineText
        }));
      }
    } else {
      var parentOutline = this.findOutlineBy(event.parentOutlineId);
      if (parentOutline) {
        parentOutline.apply(event);
      }
    }
  }

  _onOutlineRemoved(event) {
    if (!event.parentOutlineId) {
      var outline = this.findOutlineBy(event.outlineId);
      if (outline) {
        var index = this._children.indexOf(outline);
        if (index !== -1) {
          this._children.splice(index, 1);
        }
      }
    } else {
      var parentOutline = this.findOutlineBy(event.parentOutlineId);
      if (parentOutline) {
        parentOutline.apply(event);
      }
    }
  }

  _onOutlineTextChanged(event) {
    this._applyOutlineEvent(event);
  }

  _onOutlineNotesChanged(event) {
    this._applyOutlineEvent(event);
  }

  _onOutlineCompleted(event) {
    this._applyOutlineEvent(event);
  }

  _onOutlineIncompleted(event) {
    this._applyOutlineEvent(event);
  }

  _onOutlineTagAdded(event) {
    this._applyOutlineEvent(event);
  }

  _onOutlineTagRemoved(event) {
    this._applyOutlineEvent(event);
  }

}