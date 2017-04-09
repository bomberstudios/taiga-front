/*
 * Copyright (C) 2014-2017 Andrey Antukh <niwi@niwi.nz>
 * Copyright (C) 2014-2017 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014-2017 David Barragán Merino <bameda@dbarragan.com>
 * Copyright (C) 2014-2017 Alejandro Alonso <alejandro.alonso@kaleidos.net>
 * Copyright (C) 2014-2017 Juan Francisco Alcántara <juanfran.alcantara@kaleidos.net>
 * Copyright (C) 2014-2017 Xavi Julian <xavier.julian@kaleidos.net>
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
 * File: modules/common/filters.coffee
 */

import * as _ from "lodash"
import * as moment from "moment"
import * as Immutable from "immutable"
import * as utils from "../../utils"

export let defaultFilter = () =>
    function(value, defaultValue) {
        if (value === [null, undefined]) {
            return defaultValue;
        }
        return value;
    }
;

export let yesNoFilter = $translate =>
    function(value) {
        if (value) {
            return $translate.instant("COMMON.YES");
        }

        return $translate.instant("COMMON.NO");
    }
;

export let unslugify = () => utils.unslugify;

export let momentFormat = () =>
    function(input, format) {
        if (input) {
            return moment(input).format(format);
        }
        return "";
    }
;

export let momentFromNow = () =>
    function(input, without_suffix) {
        if (input) {
            return moment(input).fromNow(without_suffix || false);
        }
        return "";
    }
;

export let sizeFormat = () => {
    return this.taiga.sizeFormat;
};

export let toMutableFilter =  function() {
    let toMutable = js => js.toJS();

    let memoizedMutable = _.memoize(toMutable);

    return function(input) {
      if (input instanceof Immutable.List) {
        return memoizedMutable(input);
    }

      return input;
  };
};

export let byRefFilter = $filterFilter=>
    function(userstories, filter) {
        if (filter != null ? filter.startsWith("#") : undefined) {
            let cleanRef= filter.substr(1);
            return _.filter(userstories, (us:any) => String(us.ref).startsWith(cleanRef));
        }

        return $filterFilter(userstories, filter);
    }
;

export let darkerFilter = () =>
    function(color, luminosity) {
        // validate hex string
        color = new String(color).replace(/[^0-9a-f]/gi, '');
        if (color.length < 6) {
            color = color[0]+ color[0]+ color[1]+ color[1]+ color[2]+ color[2];
        }

        luminosity = luminosity || 0;

        // convert to decimal and change luminosity
        let newColor = "#";
        let c:any = 0;
        let i = 0;
        let black = 0;
        let white = 255;
        // for (i = 0; i < 3; i++)
        for (i of [0, 1, 2]) {
            c = parseInt(color.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(black, c + (luminosity * white)), white)).toString(16);
            newColor += (`00${c}`).substr(c.length);
        }

        return newColor;
    }
;

export let markdownToHTML = wysiwigService =>
    function(input) {
        if (input) {
            return wysiwigService.getHTML(input);
        }

        return "";
    }
;

export let inArray = $filter =>
    function(list, arrayFilter, element) {
        if (arrayFilter) {
            let filter = $filter("filter");
            return filter(list, listItem => arrayFilter.indexOf(listItem[element]) !== -1);
        }
    }
;