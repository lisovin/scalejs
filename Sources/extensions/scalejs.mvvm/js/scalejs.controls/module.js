/*global define */
define([
    'require',
    'knockout'
], function (
    require,
    ko
) {
    'use strict';

    /*jslint unparam: true*/
    function init(element, valueAccessor, allBindingsAccessor, vm) {
        var value = valueAccessor(),
            moduleId = value.id;

        require(['scalejs/application', moduleId], function (application, module) {
            application.registerModule(module, value, element);
        });

        return { controlsDescendantBindings: true };
    }
    /*jslint unparam: false*/

    ko.bindingHandlers.module = {
        init: init
    };
});
