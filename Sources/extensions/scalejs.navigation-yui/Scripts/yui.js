define(function () {
    "use strict";
    // because it's easier then typeof, and undefined isn't allowed in ES5
    var notDefined,
        Y,
        defaultSrc = 'http://yui.yahooapis.com/3.7.2/build/yui/yui-min.js';

    function loadModule(name, load, config) {
        if (config.isBuild) {
            //buildMap[name] = true;
            load(Y);
        } else {
            // split the name into an array, with modules that YUI.use
            // needs to load.
            var useParams = name.split(',');

            // If it's just trying to load YUI, return that
            if (name === 'yui') {
                return load(Y);
            }

            // Add a callback for Y.use as the end of useParams
            useParams.push(function (Y) {
                // tell RequireJS Y has been loaded
                load(Y);
            });

            Y.use.apply(Y, useParams);
        }
    }

    return {
        load: function (name, req, load, config) {
            var src,
                configYUI = config.YUI;

            // YUI is loaded, load the module
            if (Y) {
                loadModule(name, load, config);

                // YUI isn't loaded, load it from the config.
            } else if (typeof YUI === 'undefined') {
                if (typeof configYUI === 'string') {
                    src = configYUI;
                    configYUI = notDefined;
                } else if (typeof configYUI === 'object') {
                    src = configYUI.src;
                } else {
                    src = defaultSrc;
                    configYUI = notDefined;
                }

                req([src], function () {
                    // Create a YUI instance, for modules using this plugin
                    if (Y) {
                        loadModule(name, load, config);
                    } else {
                        if (typeof YUI != 'undefined') {
                            Y = YUI(configYUI);
                        }
                        loadModule(name, load, config);
                    }
                });

                // YUI is loaded and Y isn't assigned yet
            } else if (Y === notDefined) {
                // create a new YUI instance
                Y = YUI(configYUI);
                loadModule(name, load, config);

                // YUI wasn't found, throw an error
            } else {
                throw 'YUI could not be located';
            }
        },

        write: function (pluginName, moduleName, write, config) {
            write.asModule("yui!"+moduleName, "define(['yui!base,"+moduleName+"'], function (Y) { return Y;});\n");
        } 
    };
})
