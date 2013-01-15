/*global define,window */
define(function () {
    'use strict';

    var isExtensionsRegistered = false,
        windowType = typeof (window);


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
                        var extensions = arguments;
                        // it's possible that core was not loaded by any of the extensions, so ensure it's loaded
                        req(['scalejs/core'], function (core) {
                            if (!config.isBuild && !isExtensionsRegistered) {
                                core.array.iter(extensions, function (extension, i) {
                                    if (extension !== undefined && extension !== null) {
                                        extension.scalejsId = extensionNames[i];
                                        core.registerExtension(extension);
                                    }
                                });
                                core.buildCore();
                                isExtensionsRegistered = true;
                            }

                            load(loadedModule);
                        });
                    });
                } else {
                    load(loadedModule);
                }
            });
        }
    };
});
