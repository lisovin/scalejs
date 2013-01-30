/*global define,document */
define([
    'require'
], function (
    require
) {
    'use strict';

    function Sandbox(id, core, containerElement) {
        var has = core.object.has,
            is = core.type.is,
        //warn = core.log.warn,
            $ = core.dom.$,
            createElement = core.dom.createElement,
            box,
            dom;

        function getId() {
            return id;
        }

        function getBox() {
            if (has(box)) {
                return box;
            }

            box = $('#' + id);
            if (!has(box)) {
                if (has(containerElement)) {
                    containerElement.setAttribute('id', id);
                    box = containerElement;
                } else {
                    box = createElement('div', { 'id': id });
                    document.body.appendChild(box);
                }
            }

            return box;
        }

        function loadModule(path, params) {
            require(
                ['scalejs/application', path],
                function (application, module) {
                    application.registerModule(module, params, getBox());
                }
            );
        }

        function appendHtml(html) {
            var myBox = getBox();
            core.dom.appendElementHtml(myBox, html);
        }

        dom = core.object.merge(core.dom, {
            appendHtml: appendHtml
        });
        delete dom.appendElementHtml;

        return {
            getId: getId,
            getBox: getBox,
            has: has,
            is: is,
            loadModule: loadModule,
            object: core.object,
            log: core.log,
            array: core.array,
            dom: dom
        };
    }

    return Sandbox;
});
