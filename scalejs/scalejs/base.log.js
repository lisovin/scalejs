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

    function info() {
        if (has(window, 'console', 'info')) {
            if (!has(window, 'console', 'info', 'apply')) {
                // IE8
                window.console.info(Array.prototype.join.call(arguments));
            } else {
                window.console.info.apply(window.console, arguments);
            }
        }
    }

    function warn() {
        if (has(window, 'console', 'warn')) {
            window.console.warn.apply(window.console, arguments);
            return;
        }

        info(arguments);
    }

    function error() {
        if (has(window, 'console', 'error')) {
            window.console.error.apply(window.console, arguments);
            return;
        }

        info(arguments);
    }

    function debug() {
        if (has(window, 'console', 'debug')) {
            window.console.debug.apply(window.console, arguments);
            return;
        }

        info(arguments);
    }

    return {
        info: info,
        warn: warn,
        debug: debug,
        error: error,
        formatException: formatException
    };
});
