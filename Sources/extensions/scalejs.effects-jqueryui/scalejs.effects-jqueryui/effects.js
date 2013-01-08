/*global define*/
define([
    'jQuery',
    'jQuery-ui-effects'
], function (
    $
) {
    'use strict';

    function show(element, config) {
        if ($(element).css('display') === 'none') {
            $(element).show(config);
        }
    }

    function hide(element, config) {
        if ($(element).css('display') !== 'none') {
            $(element).hide(config);
        }
    }

    function animate(element, properties, options) {
        $(element).animate(properties, options);
    }

    return {
        show: show,
        hide: hide,
        animate: animate
    };
});
