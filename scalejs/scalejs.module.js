/*global define*/
/*jslint unparam:true*/
define(function () {
    'use strict';

    return {
        load: function (name, req, onLoad, config) {
            req([name, 'scalejs!application'], function (appModule, application) {
                if (config.isBuild) {
                    onLoad();
                } else {
                    application.registerModules(appModule);
                    onLoad(appModule);
                }
            });
        }
    };
});