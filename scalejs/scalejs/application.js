/*
 * Core Application
 *
 * The Core Application manages the life cycle of modules.
 */
/*global define,window */
define([
    './core'
], function (
    core
) {
    'use strict';

    var moduleRegistrations = [],
        moduleInstances = [],
        applicationState = 'STOPPED';
    /*
    function buildCore() {
        core.buildCore();
    }*/

    function createModule(module, params, containerElement) {
        var moduleInstance, message;

        try {
            moduleInstance = module.newInstance(params, containerElement);
            core.array.addOne(moduleInstances, moduleInstance);

            return moduleInstance;
        } catch (ex) {
            message = core.log.formatException(ex);
            core.log.error('ERROR: Failed to create an instance of module "' +
                    module.getModuleId() +
                    '" with params "' + params + '"\n' +
                    message);
        }
    }

    function registerModule(module, params, containerElement) {
        moduleRegistrations.push({
            module: module,
            params: params,
            containerElement: containerElement
        });

        if (applicationState === 'STARTED' ||
                applicationState === 'STARTING') {
            var moduleInstance = createModule(module, params, containerElement);
            if (core.object.has(moduleInstance)) {
                moduleInstance.start();
            }
        }
    }

    function createAll() {
        var i;
        for (i = 0; i < moduleRegistrations.length; i += 1) {
            createModule(moduleRegistrations[i].module,
                             moduleRegistrations[i].params,
                             moduleRegistrations[i].containerElement);
        }
    }

    function startAll() {
        applicationState = 'STARTING';
        core.log.debug('Starting the application...');

        var i,
            message,
            // PL: we need a copy for a case when a new module registered during the start of another module.
            // This will add a new instance of the module to moduleInstances array which we don't want to 
            // start (since it was started during the reigstration already)
            moduleInstancesCopy = core.array.copy(moduleInstances);
        for (i = 0; i < moduleInstancesCopy.length; i += 1) {
            try {
                moduleInstances[i].start();
            } catch (ex) {
                message = core.log.formatException(ex);
                core.log.error('ERROR: Failed to start module "' +
                        moduleInstances[i] + '"\n' + message);
            }
        }

        applicationState = 'STARTED';
        core.log.debug("Application started.");
    }

    function stopAll() {
        applicationState = 'STOPPING';
        core.log.debug('Stopping the application...');

        var i,
            message;
        for (i = 0; i < moduleInstances.length; i += 1) {
            try {
                moduleInstances[i].end();
            } catch (ex) {
                message = core.log.formatException(ex);
                core.log.error('ERROR: Failed to end module "' +
                        moduleInstances[i] + '"\n' + message);
            }
        }
        core.array.removeAll(moduleInstances);

        applicationState = 'STOPPED';
        core.log.debug("Application stopped.");
    }

    function run() {
        // Build core 
        //buildCore();
        // Create all modules
        createAll();
        startAll();
        window.onunload = stopAll;
        //unloadSubscription = subscribeToEvent("unload", window, endAll);
    }

    return {
        registerModule: registerModule,
        startAll: startAll,
        stopAll: stopAll,
        run: run
    };
});
