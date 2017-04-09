/*
 * Copyright (C) 2014-2017 Taiga Agile LLC <taiga@taiga.io>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * File: dropdown-user.directive.coffee
 */

import * as angular from "angular"
import * as _ from "lodash"
import {defineImmutableProperty} from "../../../ts/utils"

let DropdownUserDirective = function(authService, configService, locationService,
        navUrlsService, feedbackService, $rootScope) {

    let link = function(scope, el, attrs, ctrl) {
        scope.vm = {};
        scope.vm.isFeedbackEnabled = configService.get("feedbackEnabled");
        defineImmutableProperty(scope.vm, "user", () => authService.userData);

        scope.vm.logout = function() {
            authService.logout();
            locationService.url(navUrlsService.resolve("discover"));
            return locationService.search({});
        };

        scope.vm.sendFeedback = () => feedbackService.sendFeedback();

        return scope.vm.userSettingsPlugins = _.filter($rootScope.userSettingsPlugins, {userMenu: true});
    };

    let directive = {
        templateUrl: "navigation-bar/dropdown-user/dropdown-user.html",
        scope: {},
        link
    };

    return directive;
};

DropdownUserDirective.$inject = [
    "$tgAuth",
    "$tgConfig",
    "$tgLocation",
    "$tgNavUrls",
    "tgFeedbackService",
    "$rootScope"
];

angular.module("taigaNavigationBar").directive("tgDropdownUser", DropdownUserDirective);