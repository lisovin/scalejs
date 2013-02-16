/*global define,document */
define(function (
) {
    'use strict';

    function sandbox(id, core) {
        function getId() {
            return id;
        }

        return {
            getId: getId,
            object: core.object,
            type: core.type,
            log: core.log,
            array: core.array,
            functional: core.functional,
            onApplicationStarted: core.onApplicationStarted
        };
    }

    return sandbox;
});
