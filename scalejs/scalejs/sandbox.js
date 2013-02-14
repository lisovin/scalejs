/*global define,document */
define([
    'require'
], function (
    require
) {
    'use strict';

    function sandbox(id, core) {
        function getId() {
            return id;
        }

        function loadModule(path, params) {
            require(
                ['scalejs/application', path],
                function (application, module) {
                    application.registerModule(module, params);
                }
            );
        }

        return {
            getId: getId,
            loadModule: loadModule,
            object: core.object,
            type: core.type,
            log: core.log,
            array: core.array
        };
    }

    return sandbox;
});
