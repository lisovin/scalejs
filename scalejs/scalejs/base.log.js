/*global define,window,document*/
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
        if (has(window.console)) {
            window.console.info(message);
        }
    }

    function warn(message) {
        if (has(window.console)) {
            window.console.warn(message);
        }
    }

    function error(message) {
        if (has(window.console)) {
            window.console.error(message);
        }
    }

    function debug(message) {
        if (has(window.console)) {
            if (has(window.console, 'debug')) {
                window.console.debug(message);
            } else {
                window.console.info(message);
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
