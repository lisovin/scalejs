/*global define*/
define([
    '$projectname$/part1'
], function (
    part1
) {
    'use strict';

    // Alternative method to extend the core would be to have 
    // buildCore function that extends the core with functionality
    /*
    function buildCore(core) {
        var extend = core.object.extend;

        extend(core, { part1 : part1 });
    }
    */
    // Alternative method to extend the sandbox would be to have 
    // buildSandbox function that extends the sandbox with functionality
    /*
    function buildSandbox(sandbox) {
        var extend = core.object.extend;

        extend(sandbox, { part1 : part1 });
    }
    */
    return {
        // Set the object that would extend the core.
        // Alternatively you can provide buildCore function.
        core: {
            part1 : part1
        },
        // Set the object that would extend the sandbox.
        // Alternatively you can provide buildSandbox function.
        sandbox: {
            part1 : part1
        }
    };
});

