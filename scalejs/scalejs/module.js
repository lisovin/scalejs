/*
 * Core Module of Scalable JavaScript Application
 *
 * Each Module corresponds to an independent unit of functionality.
 */
/*global define */
define([
    './core'
], function (
    core
) {
    'use strict';

    function module(moduleId, creator) {
        function getModuleId() {
            return moduleId;
        }

        function newInstance() {
            var instance,
                sandbox;

            sandbox = core.buildSandbox(moduleId);
            sandbox.getModuleId = function () { return moduleId; };

            instance = creator(sandbox);

            return {
                toString: getModuleId
            };
        }

        return {
            getModuleId: getModuleId,
            toString: getModuleId,
            newInstance: newInstance
        };
    }

    return module;
});
