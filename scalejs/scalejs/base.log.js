/*global define,console,document*/
define([
    './base.object'
], function (
    object
) {
    'use strict';

    var has = object.has;

    function formatException(ex) {
        var stack = has(ex, 'stack') ? String(ex.stack) : '',
            message = has(ex, 'message') ? ex.message : '';
        return 'Error: ' + message + '\nStack: ' + stack;
    }

    function info(message) {
        if (has(console)) {
            console.info(message);
        }
    }

    function warn(message) {
        if (has(console)) {
            console.warn(message);
        }
    }

    function error(message) {
        if (has(console)) {
            console.error(message);
        }
    }

    function debug(message) {
        if (has(console)) {
            if (has(console, 'debug')) {
                console.debug(message);
            } else {
                info(message);
            }
        }
    }

    return {
        info: info,
        warn: warn,
        debug: debug,
        error: error,
        formatException: formatException
    };
});
