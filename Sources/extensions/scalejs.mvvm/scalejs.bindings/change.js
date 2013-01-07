/*global define*/
define([
    'knockout',
    'scalejs!core'
], function (
    ko,
    core
) {
    'use strict';

    var is = core.type.is,
        has = core.object.has;

    /*jslint unparam: true*/
    function init(element, valueAccessor, allBindingsAccessor, viewModel) {
        if (!has(viewModel)) {
            return;
        }

        var unwrap = ko.utils.unwrapObservable,
            value = valueAccessor(),
            properties = unwrap(value),
            //toEnumerable = core.linq.enumerable.from,
            property,
            handler,
            currentValue,
            changeHandler;

        function bindPropertyChangeHandler(h) {
            return function (newValue) {
                if (newValue !== currentValue) {
                    currentValue = newValue;
                    h.call(viewModel, newValue, element);
                }
            };
        }

        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                handler = properties[property];
                if (is(handler.initial, 'function')) {
                    handler.initial.apply(viewModel, [unwrap(viewModel[property]), element]);
                }
                if (is(handler.update, 'function')) {
                    changeHandler = bindPropertyChangeHandler(handler.update);
                }
                if (is(handler, 'function')) {
                    changeHandler = bindPropertyChangeHandler(handler);
                }
                if (changeHandler) {
                    viewModel[property].subscribe(changeHandler);
                }
            }
        }
    }
    /*jslint unparam: false*/

    ko.bindingHandlers.change = {
        init: init
    };
});
