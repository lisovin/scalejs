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
    type
) {
    'use strict';

    return {
        array: array,
        log: log,
        object: object,
        type: type
    };
});
