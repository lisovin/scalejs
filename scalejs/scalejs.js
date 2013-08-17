/*global define,window,requirejs */
define(function () {
    'use strict';
    var extensionNames;

    return {
        load: function (name, req, load, config) {
            if (name === 'extensions') {
                if (config.scalejs && config.scalejs.extensions) {
                    extensionNames = config.scalejs.extensions;
                    req(extensionNames, function () {
                        load(Array.prototype.slice(arguments));
                    });
                } else {
                    req(['scalejs/extensions'], function () {
                        load(Array.prototype.slice(arguments));
                    }, function () {
                        // No extensions defined, which is strange but might be ok.
                        load([]);
                    });
                }
                return;
            }

            if (name === 'application') {
                req(['scalejs!extensions'], function () {
                    req(['scalejs/application'], function (application) {
                        load(application);
                    });
                });
                return;
            }

            if (name.indexOf('sandbox') === 0) {
                req(['scalejs!core', 'scalejs!extensions'], function (core) {
                    if (config.isBuild) {
                        load();
                    } else {
                        var sandbox = core.buildSandbox(name);
                        load(sandbox);
                    }
                });
                return;
            }

            req(['scalejs/' + name], function (loadedModule) {
                load(loadedModule);
            });
        },

        write: function (pluginName, moduleName, write) {
            if (pluginName === 'scalejs' && moduleName === 'application') {
                write('define("scalejs/extensions", ' + JSON.stringify(extensionNames) + ', function () { return Array.prototype.slice(arguments); })');
            }
        }
    };
});
