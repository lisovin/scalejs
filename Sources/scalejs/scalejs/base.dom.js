/*global define,console,document*/
define(function () {
    'use strict';

    function $(id) {
        return document.getElementById(id);
    }

    function appendElementHtml(domElement, html) {
        var div = document.createElement('div'),
            n;

        div.innerHTML = html;

        for (n = 0; n < div.childNodes.length; n += 1) {
            domElement.appendChild(div.childNodes[n].cloneNode(true));
        }
    }

    function createElement(name, attributes) {
        var elName = name,
            el,
            p;
        // convert name to uppercase to ensure cross-browser consistency
        // (IE keeps original case for unknown nodeName/tagName)
        if (name && name.toUpperCase) {
            elName = name.toUpperCase();
        }
        el = document.createElement(elName);

        // set attributes
        for (p in attributes) {
            if (attributes.hasOwnProperty(p)) {
                el.setAttribute(p, attributes[p]);
            }
        }
        return el;
    }


    return {
        $: $,
        createElement: createElement,
        appendElementHtml: appendElementHtml
    };
});
