/*global define*/
define([
    'scalejs.effects-jqueryui/effects'
], function (
    effects
) {
    'use strict';

    return {
        effects: {
            show: effects.show,
            hide: effects.hide,
            animate: effects.animate
        }
    };
});