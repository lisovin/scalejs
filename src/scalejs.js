/*global define*/
define(function () {
    'use strict';
    var extensionNames;

    return {
        load: function (name, req, load, config) {
            var moduleNames;

            if (name === 'extensions') {
                if (config.scalejs && config.scalejs.extensions) {
                    extensionNames = config.scalejs.extensions;
                    req(extensionNames, function () {
                        load(Array.prototype.slice(arguments));
                    });
                } else {
                    req(['scalejs.extensions'], function () {
                        load(Array.prototype.slice(arguments));
                    }, function () {
                        // No extensions defined, which is strange but might be ok.
                        load([]);
                    });
                }
            } else if (name.indexOf('application') === 0) {
                moduleNames = name
                    .substring('application'.length + 1)
                    .match(/([^,]+)/g) || [];

                moduleNames = moduleNames.map(function (n) {
                    if (n.indexOf('/') === -1) {
                        return 'app/' + n + '/' + n + 'Module';
                    }

                    return n;
                });

                moduleNames.push('scalejs.application');

                req(['scalejs!extensions'], function () {
                    req(moduleNames, function () {
                        var application = arguments[arguments.length - 1],
                            modules = Array.prototype.slice.call(arguments, 0, arguments.length - 1);

                        if (!config.isBuild) {
                            application.registerModules.apply(null, modules);
                        }

                        load(application);
                    });
                });
            } else {
                req(['scalejs.' + name], function (loadedModule) {
                    load(loadedModule);
                });
            }
        },

        write: function (pluginName, moduleName, write) {
            if (pluginName === 'scalejs' && moduleName.indexOf('application') === 0) {
                write('define("scalejs.extensions", ' + JSON.stringify(extensionNames) + ', function () { return Array.prototype.slice(arguments); })');
            }
        }
    };
});
