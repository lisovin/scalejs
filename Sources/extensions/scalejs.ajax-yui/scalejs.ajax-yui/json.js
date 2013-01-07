/*global define,console,document*/
define([
    'yui!json'
], function (
    Y
) {
    'use strict';

    function toJson(obj) {
        return Y.JSON.stringify(obj);
    }

    function fromJson(json) {
        if (json === "") {
            return {};
        }
        return Y.JSON.parse(json);
    }

    return {
        toJson: toJson,
        fromJson: fromJson
    };
});
