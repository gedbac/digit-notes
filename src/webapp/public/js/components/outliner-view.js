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

import React from "react";
import View from "./view";
import OutlinerStore from "../stores/outliner-store";
import Outline from "./outline";

export default class OutlinerView extends View {

  constructor(props) {
    super(props);
    this._outlinerActions = null;
    this._outlinerStore = null;
    this._onChange = this._onChange.bind(this);
    this.state = {
      document: null
    };
  }

  get outlinerActions() {
    return this._outlinerActions;
  }

  set outlinerActions(value) {
    this._outlinerActions = value;
  }

  get outlinerStore() {
    return this._outlinerStore;
  }

  set outlinerStore(value) {
    this._outlinerStore = value;
  }

  componentDidMount() {
    this.outlinerStore.on(OutlinerStore.CHANGED, this._onChange);
    setTimeout(() => {
      this.outlinerActions.loadOutlineDocument();
    }, 2000);
  }

  componentWillUnmount() {
    this.outlinerStore.off(this.outlinerStore.CHANGED, this._onChange);
  }

  render() {
    var content = null;
    if (!this.state.document) {
      content = this._renderOutlinesLoader();
    } else {
      content = this._renderOutlines(this.state.document);
    }
    return (
      <div className="outliner-view grid-4pt">
        { content }
      </div>
    );
  }

  _renderOutlinesLoader() {
    return (
      <div className="content-loader">
        <div className="outline-text"></div>
        <div className="outline-notes"></div>
      </div>
    );
  }

  _renderOutlines(document) {
    if (document && document.children && document.children.length > 0) {
      return document.children.map(outline => (
        <Outline
          key={outline.uid}
          text={outline.text}
        />
      ));
    }
    return null;
  }

  _onChange() {
    this.setState({
      document: this.outlinerStore.document
    });
  }

}