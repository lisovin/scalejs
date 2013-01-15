/*
 * Minimal base implementation. 
 */
/*global define,console,document*/
define([
    './base.array',
    './base.dom',
    './base.log',
    './base.object',
    './base.type'
], function (
    array,
    dom,
    log,
    object,
    type
) {
    'use strict';

    return {
        array: array,
        dom: dom,
        log: log,
        object: object,
        type: type
    };
});
