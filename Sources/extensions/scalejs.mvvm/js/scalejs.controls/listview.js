/*global define*/
define([
    'knockout'
], function (
    ko
) {
    'use strict';

    var unwrap = ko.utils.unwrapObservable;

    function wrapValueAccessor(valueAccessor) {
        return function () {
            var value = valueAccessor();
            return {
                name: value.itemTemplate,
                foreach: unwrap(value.itemsSource)
            };
        };
    }

    function init(
        element,
        valueAccessor,
        allBindingsAccessor,
        viewModel,
        bindingContext
    ) {
        return ko.bindingHandlers.template.init(
            element,
            wrapValueAccessor(valueAccessor),
            allBindingsAccessor,
            viewModel,
            bindingContext
        );
    }

    function update(
        element,
        valueAccessor,
        allBindingsAccessor,
        viewModel,
        bindingContext
    ) {
        return ko.bindingHandlers.template.update(
            element,
            wrapValueAccessor(valueAccessor),
            allBindingsAccessor,
            viewModel,
            bindingContext
        );
    }

    ko.bindingHandlers.listview = {
        init: init,
        update: update
    };
});
