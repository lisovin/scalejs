/*global define */
/// <reference path="../Scripts/es5-shim.js" />
define([
    './base',
    './sandbox'
],
    function (
        base,
        Sandbox
    ) {
        'use strict';
        // Imports
        var has = base.object.has,
            is = base.type.is,
            extend = base.object.extend,
            addOne = base.array.addOne,
            error = base.log.error,
            formatException = base.log.formatException,
            extensionRegistrations = [],
            core,
            applicationStartedListeners = [];

        function registerExtension(extension) {
            var message;

            try {
                if (is(extension, 'buildCore', 'function')) {
                    // If extension has `buildCore` method then delegate to it.
                    extension.buildCore(core);
                } else if (has(extension, 'core')) {
                    // If extension has `core` property then extend core with it.
                    extend(core, extension.core);
                } else {
                    // Otherwise extension core with the extension itself.
                    extend(core, extension);
                }
            } catch (ex) {
                message = formatException(ex);
                error('Error: Failed to build core with extension "' + extension + '"\n' + message);
            }
            addOne(extensionRegistrations, extension);
        }

        function buildSandbox(id, containerElement) {
            if (!has(id)) {
                return null;
            }

            // Create module instance specific Sandbox 
            var sandbox = new Sandbox(id, core, containerElement),
                i,
                extension,
                message;

            // Add extensions to Sandbox
            for (i = 0; i < extensionRegistrations.length; i += 1) {
                extension = extensionRegistrations[i];

                try {
                    // If extension has buildSandbox method use it to build sandbox
                    // Otherwise simply add extension to the sandbox at the specified path
                    if (is(extension, 'buildSandbox', 'function')) {
                        extension.buildSandbox(sandbox);
                    } else if (has(extension, 'sandbox')) {
                        extend(sandbox, extension.sandbox);
                    } else {
                        extend(sandbox, extension);
                    }
                } catch (ex) {
                    message = formatException(ex);
                    error('Error: Failed to build sandbox with extension "' +
                        extension + '"\n' + message);
                }
            }

            return sandbox;
        }

        function onApplicationStarted(listener) {
            applicationStartedListeners.push(listener);
        }

        function notifyApplicationStarted() {
            applicationStartedListeners.forEach(function (listener) {
                listener();
            });
        }

        core = {
            type: base.type,
            object: base.object,
            array: base.array,
            log: base.log,
            registerExtension: registerExtension,
            buildSandbox: buildSandbox,
            notifyApplicationStarted: notifyApplicationStarted,
            onApplicationStarted: onApplicationStarted
        };

        return core;
    });
