/*global define */
define([
    'scalejs!module'
], function (
    module
) {
    'use strict';

    function create(sandbox) {
        var info = sandbox.log.info;

        function start() {
            info('Hello World!');
        }

        return {
            start: start
        };
    }

    return module('main', create);
});