/*global define,window */
define(['es5-shim', 'json2'], function () {
    'use strict';

    var windowType = typeof (window);

    // IE weirdness. 
    if (windowType !== 'undefined' && window.console === 'undefined') {
        window.console = window.Console;
    }

    return {
        load: function (name, req, load, config) {
            var extensionNames = config.scalejs ? config.scalejs.extensions || [] : [],
                moduleName = 'scalejs/' + name;

            req([moduleName], function (loadedModule) {
                if (moduleName === 'scalejs/application') {
                    req(extensionNames, function () {
                        load(loadedModule);
                    });
                } else {
                    load(loadedModule);
                }
            });
        }
    };
});
