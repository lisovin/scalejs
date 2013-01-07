/*global define*/
define([
    'scalejs.mvvm/mvvm',
    'scalejs.controls/content',
    'scalejs.controls/module',
    'scalejs.controls/listview',
    'scalejs.bindings/change'
], function (
    mvvm
) {
    'use strict';

    function buildSandbox(sandbox) {
        mvvm.buildSandbox(sandbox);
    }

    return {
        core: {
            mvvm: mvvm
        },
        buildSandbox: buildSandbox
    };
});

