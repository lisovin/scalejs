/*global define */
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
            core = {};

        function registerExtension(extension) {
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

        function buildCore() {
            var i,
                d,
                extensions = extensionRegistrations.slice(),
                extension,
                message,
                toBuild,
                unresolved,
                notBuiltIds,
                dependenciesGraph;

            function unresolvedDependencies(extension) {
                var i,
                    unresolved = [],
                    dependencies = extension.dependencies || [];

                for (i = 0; i < dependencies.length; i += 1) {
                    if (!has(core, dependencies[i])) {
                        unresolved.push(dependencies[i]);
                    }
                }

                return unresolved;
            }

            while (extensions.length > 0) {
                i = 0;
                toBuild = extensions.length;
                while (i < extensions.length) {
                    extension = extensions[i];
                    if (is(extension, 'buildCore', 'function')) {
                        try {
                            // extension might be not ready to be built 
                            // (e.g. it depends on some other extensions 
                            // that didn't build yet)
                            // if buildCore succeeded then remove the extension 
                            // from the list of extensions to build.
                            unresolved = unresolvedDependencies(extension);
                            if (unresolved.length > 0) {
                                i += 1;
                            } else {
                                extension.buildCore(core);
                                extensions.splice(i, 1);
                            }
                        } catch (ex) {
                            message = formatException(ex);
                            error('Error: Failed to build core with extension ["' +
                                extension.scalejsId + ']"\n' + message);
                            extensions.splice(i, 1);
                        }
                    } else if (has(extension, 'core')) {
                        if (has(extension.core, 'buildSandbox')) {
                            error('Error: Extension ["' + extension.scalejsId +
                                '"] has core with buildSandbox defined. ' +
                                'buildSandbox must be the top most function ' +
                                'of the extension.');
                        } else {
                            extend(core, extension.core);
                            extensions.splice(i, 1);
                        }
                    } else if (!has(extension, 'buildSandbox') &&
                            !has(extension, 'sandbox')) {
                        extend(core, extension);
                        extensions.splice(i, 1);
                    } else {
                        // extension only extends sandbox
                        extensions.splice(i, 1);
                    }
                }
                if (toBuild === extensions.length) {
                    // no progress - build is stuck
                    break;
                }
            }

            if (extensions.length > 0) {
                notBuiltIds = '';
                dependenciesGraph = '';
                for (i = 0; i < extensions.length; i += 1) {
                    notBuiltIds += extensions[i].scalejsId + ', ';
                    dependenciesGraph += extensions[i].scalejsId + ': [';
                    unresolved = unresolvedDependencies(extensions[i]);
                    for (d = 0; d < unresolved.length; d += 1) {
                        dependenciesGraph += unresolved[d] + ', ';
                    }
                    dependenciesGraph = dependenciesGraph.substring(0,
                        dependenciesGraph.length - 2) + ']\n';
                }
                error('Error: Failed to build core with extensions [' +
                    notBuiltIds.substring(0, notBuiltIds.length - 2) + '].\n' +
                    'Dependencies graph:\n' + dependenciesGraph);
            }
        }

        base.object.extend(core, {
            type: base.type,
            object: base.object,
            proxy: base.proxy,
            array: base.array,
            log: base.log,
            dom: base.dom,
            registerExtension: registerExtension,
            buildSandbox: buildSandbox,
            buildCore: buildCore
        });

        return core;
    });
