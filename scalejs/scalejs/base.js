/*
 * Minimal base implementation.
 */

/*global define*/
define([
    './base.array',
    './base.log',
    './base.object',
    './base.type'
], function (
    array,
    log,
    object,
    type
) {
    'use strict';

    return {
        type:   type,
        object: object,
        array:  array,
        log:    log
    };
});
