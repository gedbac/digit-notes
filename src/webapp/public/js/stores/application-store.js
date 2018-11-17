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

import Store from "./store";
import DependencyInjection from "../shared/dependency-injection";
import NavigationActionTypes from "../actions/application-action-types";
import StartupView from "../components/startup-view";
import OutlinerView from "../components/outliner-view";

export default class ApplicationStore extends Store {

  static get CHANGED() { return "CHANGED"; }

  constructor(dispatcher, serviceProvider) {
    super(dispatcher, serviceProvider);
    this._currentView = null;
  }

  get currentView() {
    return this._currentView;
  }

  _onAction(payload) {
    if (payload) {
      switch(payload.actionType) {
        case NavigationActionTypes.NAVIGATE_TO_VIEW:
          this._onNavigateTo(payload.viewName);
          break;
        default:
          break;
      }
    }
  }

  _onNavigateTo(viewName) {
    if (viewName) {
      if (viewName === "startup-view") {
        this._currentView = DependencyInjection.inject(StartupView, this.serviceProvider);
      } else if (viewName === "outlines-view") {
        this._currentView = DependencyInjection.inject(OutlinerView, this.serviceProvider);
      } else {
        this._currentView = null;
      }
      this.trigger(ApplicationStore.CHANGED);
    }
  }

}