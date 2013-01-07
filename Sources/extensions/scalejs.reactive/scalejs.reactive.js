/*global define*/
define([
    'scalejs!core',
    'scalejs.reactive/reactive',
    'scalejs.reactive/events'
], function (
    core,
    reactive,
    events
) {
    'use strict';

    var merge = core.object.merge;

    return {
        reactive: merge(reactive, { events: events })
    };
});
