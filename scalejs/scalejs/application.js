/*
 * Core Application
 *
 * The Core Application manages the life cycle of modules.
 */
/*global define,window */
define([
    'scalejs!core'
], function (
    core
) {
    'use strict';

    var addOne = core.array.addOne,
        error = core.log.error,
        debug = core.log.debug,
        moduleRegistrations = [],
        moduleInstances = [];

    function registerModule(module) {
        // Dynamic module loading is no longer supported for simplicity.
        // Module is free to load any of its resources dynamically.
        // Or an extension can provide dynamic module loading capabilities as needed.
        if (core.isApplicationStarted()) {
            throw new Error('Can\'t register module "' + module + '" since the application is already running.',
                            'Dynamic module loading is not supported.');
        }

        moduleRegistrations.push(module);
    }

    function createModule(module) {
        var moduleInstance;

        try {
            moduleInstance = module.newInstance();
            addOne(moduleInstances, moduleInstance);

            return moduleInstance;
        } catch (ex) {
            error('Fatal error during application initialization.',
                  'Failed to create an instance of module "' + module.getModuleId() + '".',
                  'See following exception for more details.',
                  ex);
            throw ex;
        }
    }

    function createAll() {
        moduleRegistrations.forEach(function (registration) {
            createModule(registration);
        });
    }

    function startAll() {
        debug("Application started.");

        core.notifyApplicationStarted();
    }

    function run() {
        createAll();
        startAll();
    }

    return {
        registerModule: registerModule,
        run: run
    };
});
