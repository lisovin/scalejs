/*global define*/
/*jslint todo: true*/
define([
    'scalejs!core',
    'scalejs.navigation-yui/navigation'
], function (
    core,
    navigation
) {
    'use strict';

    var extend = core.object.extend;

    function buildCore() {
        var extension = navigation(core);
        extend(core, { navigation: extension });
    }

    function buildSandbox(sandbox) {
        // TODO: consider whether it's worth filtering out events
        // only for the module
        extend(sandbox, { navigation: core.navigation });
    }

    return {
        dependencies : ['reactive', 'linq'],
        buildCore    : buildCore,
        buildSandbox : buildSandbox
    };
});