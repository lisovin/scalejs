/*global define*/
define([
    'scalejs!core'
], function (
    core
) {
    'use strict';

    function function1() {
        core.debug('main.function1 is called');
    }

    return {
        function1: function1
    };
});

