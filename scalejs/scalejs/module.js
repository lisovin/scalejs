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
        var lastInstanceId = 0;

        function getModuleId() {
            return moduleId;
        }

        function newInstance(params, containerElement) {
            var //error = core.log.error,
                //formatException = core.log.formatException,
                is = core.type.is,
                instance,
                instanceId,
                sandbox;

            // incremente instance counter
            lastInstanceId += 1;
            instanceId = lastInstanceId;

            function start() {
                if (is(instance, 'start', 'function')) {
                    instance.start();
                }
            }

            function end() {
                if (is(instance, 'end', 'function')) {
                    instance.end();
                }
            }

            function getInstanceId() {
                return moduleId + '_' + instanceId;
            }

            sandbox = core.buildSandbox(getInstanceId(), containerElement);
            sandbox.getModuleId = function () { return moduleId; };

            instance = creator(sandbox, params);

            return {
                getInstanceId: getInstanceId,
                toString: getInstanceId,
                start: start,
                end: end
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
