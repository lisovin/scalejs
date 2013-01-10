/*global define,document*/
define([
    'scalejs!core',
    'knockout'
], function (
    core,
    ko
) {

    'use strict';

    var unwrap = ko.utils.unwrapObservable,
        has = core.object.has;

    /*jslint unparam: true*/
    function init(element, valueAccessor, allBindingsAccessor, viewModel) {
        var bindings = valueAccessor(),
            templateId = bindings.template,
            parent = element.parentNode,
            dataClass = element.getAttribute('data-class'),
            start = document.createComment('begin content: data-class="' + dataClass + '"'),
            end = document.createComment('end content: data-class="' + dataClass + '"'),
            templateInstance,
            children = [],
            child;

        parent.replaceChild(end, element);
        parent.insertBefore(start, end);

        templateInstance = document.getElementById(templateId).cloneNode(true);
        while (templateInstance.hasChildNodes()) {
            child = templateInstance.removeChild(templateInstance.firstChild);
            children.push(child);
            //parent.insertBefore(child, end);
        }

        ko.computed({
            read: function () {
                var content = unwrap(bindings.content),
                    i;
                bindings = unwrap(valueAccessor());
                if (has(content)) {
                    for (i = 0; i < children.length; i += 1) {
                        child = children[i];
                        parent.insertBefore(child, end);
                        if (child.nodeType === 1) {
                            ko.applyBindings(content, child);
                        }
                    }
                }
            },
            disposeWhenNodeIsRemoved: parent
        });

        return { 'controlsDescendantBindings': true };
    }
    /*jslint unparam: false*/

    ko.bindingHandlers.content = {
        init: init
    };
});