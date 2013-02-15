/*
 * Minimal base implementation. 
 */
/*global define,console,document*/
define([
    './base.array',
    './base.log',
    './base.object',
    './base.type',
    './base.functional'
], function (
    array,
    log,
    object,
    type,
    functional
) {
    'use strict';

    return {
        type: type,
        object: object,
        array: array,
        log: log,
        functional: functional
    };
});
