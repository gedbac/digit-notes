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

import React, { Component } from "react";
import ApplicationStore from "../stores/application-store";

export default class Application extends Component {

  constructor(props) {
    super(props);
    this._applicationStore = null;
    this._applicationActions = null;
    this._onChange = this._onChange.bind(this);
  }

  get applicationStore() {
    return this._applicationStore;
  }

  set applicationStore(value) {
    this._applicationStore = value;
  }

  get applicationActions() {
    return this._applicationActions;
  }

  set applicationActions(value) {
    this._applicationActions = value;
  }

  componentDidMount() {
    this._onChangedEventHandler = () => this._onChange();
    this.applicationStore.on(ApplicationStore.CHANGED, this._onChange);
    this.applicationActions.navigateToView("startup-view");
    setTimeout(() => {
      this.applicationActions.navigateToView("outlines-view");
    }, 2000);
  }

  componentWillUnmount() {
    this.applicationStore.off(ApplicationStore.CHANGED, this._onChange);
  }

  render() {
    if (this.state) {
      var View = this.state.view;
      return (
        <View></View>
      );
    } else {
      return null;
    }
  }

  _onChange() {
    this.setState({
      view: this.applicationStore.currentView
    });
  }

}