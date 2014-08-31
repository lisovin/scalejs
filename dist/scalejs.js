/*global define*/
define('scalejs',[],function () {
    
    var extensionNames;

    return {
        load: function (name, req, load, config) {
            var moduleNames;

            if (name === 'extensions') {
                if (config.scalejs && config.scalejs.extensions) {
                    extensionNames = config.scalejs.extensions;
                    req(extensionNames, function () {
                        load(Array.prototype.slice(arguments));
                    });
                } else {
                    req(['scalejs.extensions'], function () {
                        load(Array.prototype.slice(arguments));
                    }, function () {
                        // No extensions defined, which is strange but might be ok.
                        load([]);
                    });
                }
            } else if (name.indexOf('application') === 0) {
                moduleNames = name
                    .substring('application'.length + 1)
                    .match(/([^,]+)/g) || [];

                moduleNames = moduleNames.map(function (n) {
                    if (n.indexOf('/') === -1) {
                        return 'app/' + n + '/' + n + 'Module';
                    }

                    return n;
                });

                moduleNames.push('scalejs.application');

                req(['scalejs!extensions'], function () {
                    req(moduleNames, function () {
                        var application = arguments[arguments.length - 1],
                            modules = Array.prototype.slice.call(arguments, 0, arguments.length - 1);

                        if (!config.isBuild) {
                            application.registerModules.apply(null, modules);
                        }

                        load(application);
                    });
                });
            } else {
                req(['scalejs.' + name], function (loadedModule) {
                    load(loadedModule);
                });
            }
        },

        write: function (pluginName, moduleName, write) {
            if (pluginName === 'scalejs' && moduleName.indexOf('application') === 0) {
                write('define("scalejs.extensions", ' + JSON.stringify(extensionNames) + ', function () { return Array.prototype.slice(arguments); })');
            }
        }
    };
});

/**
 * Provides type functionality to scalejs base
 * @namespace scalejs.base
 * @module type
 */

/*global define*/
define('scalejs.base.type',[],function () {
    

    /**
     * Detects the type of the passed object
     *
     * @param {Any} obj object to find the type of
     * @memberOf type
     * @return {String} type of the passed object
     */
    function typeOf(obj) {
        if (obj === undefined) {
            return 'undefined';
        }

        if (obj === null) {
            return 'null';
        }

        var t = Object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase(),
            m;

        if (t !== 'object') {
            return t;
        }

        m = obj.constructor.toString().match(/^function\s*([$A-Z_][0-9A-Z_$]*)/i);
        if (m === null) {
            return 'object';
        }

        return m[1];
    }


    /**
     * Determines if an object (and possibly a chain of properties within
     * that object actually are of the passed type
     * (no type will be null/undefined)
     *
     * @param {Any}        value     object to test
     * @param {String}     [prop...] property chain to test within value
     * @param {Any|String} [type]    type of the object to test for
     * @memberOf type
     * @return {Boolean} if the object 'is' (see inline documentation)
     */
    function is(value) {
        // If more than two arguments are provided, the value is considered to be
        // nested within a chain of properties starting with the first argument:
        // | is(object,'parent','child','leaf','boolean')
        // will check whether the property object.parent.child.leaf exists and is
        // a boolean.
        //
        // The intent of this method is to replace unsafe guard conditions that
        // rely on type coercion:
        // | if (object && object.parent && object.parent.child) {
        // |   // Issue: all falsy values are treated like null and undefined:
        // |   // '', 0, false...
        // | }
        // with a safer check in a single call:
        // | if ( is(object,'parent','child','number') ) {
        // |   // only null and undefined values are rejected
        // |   // and the type expected (here 'number') is explicit
        // | }
        //
        // Returns:
        //   * false, if no argument is provided
        //   * false, if a single argument is provided which is null or undefined
        //   * true, if a single argument is provided, which is not null/undefined
        //   * if the type argument is a non-empty string, it is compared with the
        //     internal class of the value, put in lower case
        //   * if the type argument is a function, the instanceof operator is used
        //     to check if the value is considered an instance of the function
        //   * otherwise, the value is compared with the provided type using the
        //     strict equality operator ===
        //
        // Notes:
        // This method retrieves the internal class of the provided value using
        // | Object.prototype.toString.call(value).slice(8, -1)
        // The class is then converted to lower case.
        //
        // See "The Class of an Object" section in the JavaScript Garden for
        // more details on the internal class:
        // http://bonsaiden.github.com/JavaScript-Garden/#types.typeof
        //
        // The internal class is only guaranteed to be the same in all browsers for
        // Core JavaScript classes defined in ECMAScript. It differs for classes
        // part of the Browser Object Model (BOM) and Document Object Model (DOM):
        // window, document, DOM nodes:
        //
        //   window        - 'Object' (IE), 'Window' (Firefox,Opera),
        //                   'global' (Chrome), 'DOMWindow' (Safari)
        //   document      - 'Object' (IE),
        //                   'HTMLDocument' (Firefox,Chrome,Safari,Opera)
        //   document.body - 'Object' (IE),
        //                   'HTMLBodyElement' (Firefox,Chrome,Safari,Opera)
        //   document.createElement('div') - 'Object' (IE)
        //                   'HTMLDivElement' (Firefox,Chrome,Safari,Opera)
        //   document.createComment('') - 'Object' (IE),
        //                   'Comment' (Firefox,Chrome,Safari,Opera)

        // do not trust global undefined, which may be overridden
        var undef       = void 0,
            i,          // iterative variable
            length      = arguments.length,
            last        = length - 1,
            type,
            typeOfType,
            internalClass,
            v           = value;

        if (length === 0) {
            return false; // no argument
        }

        if (length === 1) {
            return (value !== null && value !== undef);
        }

        if (length > 2) {
            for (i = 0; i < last - 1; i += 1) {
                if (!is(v)) {
                    return false;
                }
                v = v[arguments[i + 1]];
            }
        }

        type = arguments[last];
        if (v === null) {
            return (type === null || type === 'null');
        }
        if (v === undef) {
            return (type === undef || type === 'undefined');
        }
        if (type === '') {
            return v === type;
        }

        typeOfType = typeof type;
        if (typeOfType === 'string') {
            internalClass =
                Object.prototype
                    .toString
                    .call(v)
                    .slice(8, -1)
                    .toLowerCase();
            return internalClass === type;
        }

        if (typeOfType === 'function') {
            return v instanceof type;
        }

        return v === type;
    }

    return {
        is:      is,
        typeOf:  typeOf
    };

});

/**
 * Provides object functionality to scalejs base
 * @namespace scalejs.base
 * @module object
 */

/*global define*/
define('scalejs.base.object',[
    './scalejs.base.type'
], function (
    type
) {
    

    var is = type.is;

    /**
     * Determines if an object exists and if it does checks that each in
     * the chain of properties also exist
     *
     * @param {Object|Any} obj       object to test
     * @param {String}     [prop...] property chain of the object to test
     * @memberOf object
     * @return {Boolean} if the object 'has' (see inline documentation)
     */
    function has(object) {
        // The intent of this method is to replace unsafe tests relying on type
        // coercion for optional arguments or obj properties:
        // | function on(event,options){
        // |   options = options || {}; // type coercion
        // |   if (!event || !event.data || !event.data.value){
        // |     // unsafe due to type coercion: all falsy values '', false, 0
        // |     // are discarded, not just null and undefined
        // |     return;
        // |   }
        // |   // ...
        // | }
        // with a safer test without type coercion:
        // | function on(event,options){
        // |   options = has(options)? options : {}; // no type coercion
        // |   if (!has(event,'data','value'){
        // |     // safe check: only null/undefined values are rejected;
        // |     return;
        // |   }
        // |   // ...
        // | }
        //
        // Returns:
        //   * false if no argument is provided or if the obj is null or
        //     undefined, whatever the number of arguments
        //   * true if the full chain of nested properties is found in the obj
        //     and the corresponding value is neither null nor undefined
        //   * false otherwise

        var i, // iterative variable
            length,
            o = object,
            property;

        if (!is(o)) {
            return false;
        }

        for (i = 1, length = arguments.length; i < length; i += 1) {
            property = arguments[i];
            o = o[property];
            if (!is(o)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Deep extend of the supplier into the reciever
     * @private
     *
     * @param {Object} reciever object into which to extend
     * @param {Object} supplier object from which to extend
     * @memberOf object
     * @return the reciever object for ease
     */
    function mix(receiver, supplier) {
        var p;
        for (p in supplier) {
            if (supplier.hasOwnProperty(p)) {
                if ( has(supplier, p) && has(receiver, p) &&
                     supplier[p].constructor === Object
                ) {
                    receiver[p] = mix(receiver[p], supplier[p]);
                } else {
                    receiver[p] = supplier[p];
                }
            }
        }

        return receiver;
    }

    /**
     * Merges all of the passed objects into a new object
     *
     * @param {Object} [obj...] object to mix into the new object
     * @memberOf object
     * @return {Object} the merged object
     */
    function merge() {
        var args    = arguments,
            i, // iterative variable
            len     = args.length,
            result  = { };

        for (i = 0; i < len; i += 1) {
            mix(result, args[i]);
        }

        return result;
    }

    /**
     * Clones the passed object
     *
     * @param {Object} obj object to be cloned
     * @memberOf object
     * @return {Object} the cloned object
     */
    function clone(o) {
        return merge(o);
    }

    /**
     * Extends the extension into the reciever
     *
     * @param {Object} reciever  object into which to extend
     * @param {Object} extension object from which to extend
     * @param {String} [path]    followed on the reciever before executing
     *                           the extend (form: "obj.obj.obj")
     * @memberOf object
     * @return the extended object (after having followed the path)
     */
    function extend(receiver, extension, path) {
        var props = ( has(path) ) ? path.split('.') : [ ],
            target = receiver,
            i; // iterative variable

        for (i = 0; i < props.length; i += 1) {
            if (!has(target, props[i])) {
                target[props[i]] = { };
            }
            target = target[props[i]];
        }

        mix(target, extension);

        return target;
    }

    /**
     * Obtains a value from an object following a path with the option to
     * return a default value if that object was not found
     *
     * @param {Object} o    object in which to look for the specified path
     * @param {String} path string representing the chain of properties to
     *                      to be followed (form: "obj.obj.obj")
     * @param {Any}    [defaultValue] value to return if the path does not
     *                                evaluate successfully: default undefined
     * @memberOf object
     * @return {Any} object evaluated by following the given path or the default
     *               value should that object not exist
     */
    function get(o, path, defaultValue) {
        var props   = path.split('.'),
            i, // iterative variable
            p, // current property
            success = true;

        for (i = 0; i < props.length; i += 1) {
            p = props[i];
            if (has(o, p)) {
                o = o[p];
            } else {
                success = false;
                break;
            }
        }

        return success ? o : defaultValue;
    }

    /**
     * Gives the value if it exists or the default value if not
     *
     * @param {Any} value item to check
     * @param {Any} [defaultValue] item to return if value does not exist
     * @memberOf object
     * @return value if it exists or default if not
     */
    function valueOrDefault(value, defaultValue) {
        return has(value) ? value : defaultValue;
    }

    /**
     * Stringifies an object without the chance for circular error
     *
     * @param {Object} obj object to stringify
     * @memberOf object
     * @return {String} string form of the passed object
     */
    function stringify(obj) {
        var cache = [ ];

        return JSON.stringify(obj, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    return '[Circular]';
                }
                cache.push(value);
            }
            return value;
        });
    }

    return {
        has:            has,
        valueOrDefault: valueOrDefault,
        merge:          merge,
        extend:         extend,
        clone:          clone,
        get:            get,
        stringify:      stringify
    };

});

/**
 * Provides array functionality to scalejs base
 * @namespace scalejs.base
 * @module array
 */

/*global define*/
define('scalejs.base.array',[
    './scalejs.base.object'
], function (
    object
) {
    

    var valueOrDefault = object.valueOrDefault;

    /**
     * Adds an item to the passed array if it doesn't already exist
     *
     * @param {Array} array list to add the item to
     * @param {Any}   item  thing to add to the list
     * @memberOf array
     */
    function addOne(array, item) {
        if (array.indexOf(item) < 0) {
            array.push(item);
        }
    }

    /**
     * Removes the first occurrance of the passed item from the passed array
     *
     * @param {Array} array list remove the item from
     * @param {Any}   item  item to be removed from the list
     * @memberOf array
     */
    function removeOne(array, item) {
        var found = array.indexOf(item);
        if (found > -1) {
            array.splice(found, 1);
        }
    }

    /**
     * Removes all items from an array
     *
     * @param {Array} array list to remove items from
     * @memberOf array
     */
    function removeAll(array) {
        array.splice(0, array.length);
    }

    /**
     * Copy the items from the array into a new one
     *
     * @param {Array}  array   list to copy from
     * @param {Number} [first] starting index to copy from (defult:0)
     * @param {Number} [count] number of items to copy (default:array.length)
     * @memberOf array
     * @return {Array} copied list
     */
    function copy(array, first, count) {
        first = valueOrDefault(first, 0);
        count = valueOrDefault(count, array.length);
        return Array.prototype.slice.call(array, first, count);
    }

    /**
     * Finds the passed item in the array
     *
     * @param {Array}    array   list in which to search
     * @param {Function} f       function to seach with
     * @param {Any}      content context on which to call the function
     * @memberOf array
     * @return {Any|Object} item if found, null if not
     */
    function find(array, f, context) {
        var i, // iterative variable
            l; // array length variable

        for (i = 0, l = array.length; i < l; i += 1) {
            if (array.hasOwnProperty(i) && f.call(context, array[i], i, array)) {
                return array[i];
            }
        }

        return null;
    }

    /**
     * Converts object structured like array into an array
     *
     * @param {Any}    list    object structred with numerical keys
     * @param {Number} [first] starting index to copy from (defult:0)
     * @param {Number} [count] number of items to copy (default:array.length)
     * @memberOf array
     * @return {Array} result of the array conversion
     */
    function toArray(list, start, count) {
        return copy(list, start, count);
    }

    return {
        addOne:     addOne,
        removeOne:  removeOne,
        removeAll:  removeAll,
        copy:       copy,
        find:       find,
        toArray:    toArray
    };

});

/**
 * Provides logging functionality to scalejs base
 * @namespace scalejs.base
 * @module log
 */

/*global define,console,navigator*/
define('scalejs.base.log',[
    './scalejs.base.object'
], function (
    object
) {
    

    // Workaround for IE8 and IE9 - in these browsers console.log exists but it's not a real JS function.
    // See http://stackoverflow.com/a/5539378/201958 for more details

    /*jslint sub:true*/
    /**
     * Aliases the built in console log function for IE support
     *
     * @property log
     * @type Function
     * @memberOf log
     * @private
     */
    var log = Function.prototype.call.bind(console['log'], console),


    /**
     * Detects if the current browser is IE
     *
     * IMPORTANT: the method for obtaining this information is
     *            subject to change and this functionality may
     *            break at any time
     *
     * @property IE
     * @type Boolean
     * @memberOf log
     * @private
     */
        IE = navigator.userAgent.indexOf('MSIE') > 0 ||
             navigator.userAgent.indexOf('Trident') > 0;

    /*jslint sub:false*/

    /**
     * Creates a new log function with the passed level
     * @private
     *
     * @param {String} level log level
     * @memberOf log
     * @return {Function} decorated log function
     */
    function create (level) {
        return function() {
            var args, outstring;

            args = Array.prototype.slice.call(arguments, 0);

            if (!IE) {
                args.unshift(level);

            } else {
                outstring = level + ' ';
                args.forEach(function(arg){
                    outstring += object.stringify(arg) + ' ';
                });
                args = [outstring];
            }

            log.apply(this, arguments);
        };
    }

    /**
     * Formats an exception for better output
     *
     * @param {Object} ex exception object
     * @memberOf log
     * @return {String} formatted exception
     */
    function formatException (ex) {
        var stack   = (ex.stack) ? String(ex.stack) : '',
            message = ex.message || '';
        return 'Error: ' + message + '\nStack: ' + stack;
    }

    return {
        /**
         * Logs to the console with no level
         * @method log
         * @param {Any} [message...] items to print to the console
         * @memberOf log
         */
        log:   create('      '),
        /**
         * Logs to the console with info level
         * @method info
         * @param {Any} [message...] items to print to the console
         * @memberOf log
         */
        info:  create('info: '),
        /**
         * Logs to the console with error level
         * @method error
         * @param {Any} [message...] items to print to the console
         * @memberOf log
         */
        error: create('error:'),
        /**
         * Logs to the console with warn level
         * @method warn
         * @param {Any} [message...] items to print to the console
         * @memberOf log
         */
        warn:  create('warn: '),
        /**
         * Logs to the console with debug level
         * @method debug
         * @param {Any} [message...] items to print to the console
         * @memberOf log
         */
        debug: create('debug:'),
        /** */
        formatException: formatException
    };

});

/*
 * Minimal base implementation.
 */

/*global define*/
define('scalejs.base',[
    './scalejs.base.array',
    './scalejs.base.log',
    './scalejs.base.object',
    './scalejs.base.type'
], function (
    array,
    log,
    object,
    type
) {
    

    return {
        type:   type,
        object: object,
        array:  array,
        log:    log
    };
});

/**
 * Provides core functionality of scalejs
 * @namespace scalejs.core
 * @module core
 */

/*global define*/
/// <reference path="../Scripts/es5-shim.js" />
define('scalejs.core',[
    './scalejs.base'
], function (
    base
) {
    

    // Imports
    var has         = base.object.has,
        is          = base.type.is,
        extend      = base.object.extend,
        addOne      = base.array.addOne,
        error       = base.log.error,

        /**
         * Holds the core
         * @property self
         * @type Object
         * @memberOf core
         * @private
         */
        self                        = { },
        /**
         * Holds extensions for the core and sandbox
         * @property extensions
         * @type Array
         * @memberOf core
         * @private
         */
        extensions                  = [ ],
        /**
         * Holds application event listeners
         * @property applicationEventListeners
         * @type Array
         * @memberOf core
         * @private
         */
        applicationEventListeners   = [ ],
        /**
         * Holds the current application state
         * @property isApplicationRunning
         * @type Boolean
         * @memberOf core
         * @private
         */
        isApplicationRunning        = false;

    /**
     * Registers an extension to the sandbox
     *
     * @param {Function|Object} extension function to create the extension or
     *                                    object representing the extension
     * @memberOf core
     */
    function registerExtension(extension) {
        try {
            var ext; // Actual extension

            if (is(extension, 'buildCore', 'function')) {
            // If extension has buildCore function then give it an instance of the core.
                extension.buildCore(self);
                addOne(extensions, extension);
                return; // No need to extend as that will be handled in buildCore
            }

            if (is(extension, 'function')) {
            // If extension is a function then give it an instance of the core.
                ext = extension(self);
            }
            else if (has(extension, 'core')) {
            // If extension has `core` property then extend core with it.
                ext = extension.core;
            }
            else {
            // Otherwise extend core with the extension itself.
                ext = extension;
            }

            if (ext) {
                extend(self, ext);
                addOne(extensions, extension);
            }

        } catch (ex) {
            error('Fatal error during application initialization. ',
                    'Failed to build core with extension "',
                    extension,
                    'See following exception for more details.',
                    ex);
        }
    }

    /**
     * Builds a sandbox from the current list of extensions
     *
     * @param {String} id identifier for the sandbox
     * @memberOf core
     * @return {Object} object representing the built sandbox
     */
    function buildSandbox(id) {
        if (!has(id)) {
            throw new Error('Sandbox name is required to build a sandbox.');
        }

        // Create module instance specific sandbox
        var sandbox = {
            type:   self.type,
            object: self.object,
            array:  self.array,
            log:    self.log
        };

        // Add extensions to sandbox
        extensions.forEach(function (extension) {
            try {

                // If extension has buildSandbox method use it to build sandbox
                if (is(extension, 'buildSandbox', 'function')) {
                    extension.buildSandbox(sandbox);
                }

                // If extension has a sandbox object add it
                else if (has(extension, 'sandbox')) {
                    extend(sandbox, extension.sandbox);
                }

                // Otherwise extend the sandbox with the extension
                else {
                    extend(sandbox, extension);
                }

            } catch (ex) {
                error('Fatal error during application initialization. ',
                      'Failed to build sandbox with extension "',
                      extension,
                      'See following exception for more details.',
                      ex);
                throw ex;
            }
        });

        return sandbox;
    }

    /**
     * Adds a listener to the application event
     *
     * @param {Function} listener called on application event
     * @param {String}   listener.message event description
     * @memberOf core
     */
    function onApplicationEvent(listener) {
        applicationEventListeners.push(listener);
    }

    /**
     * Notify the event listeners the application has started
     *
     * @memberOf core
     */
    function notifyApplicationStarted() {
        if (isApplicationRunning) { return; }

        isApplicationRunning = true;
        applicationEventListeners.forEach(function (listener) {
            listener('started');
        });
    }

    /**
     * Notify the event listeners the application has stopped
     *
     * @memberOf core
     */
    function notifyApplicationStopped() {
        if (!isApplicationRunning) { return; }

        isApplicationRunning = false;
        applicationEventListeners.forEach(function (listener) {
            listener('stopped');
        });
    }

    /**
     * Constant for notifying application start
     *
     * @property STARTED
     * @type String
     * @memberOf core
     */
    Object.defineProperty(self, 'STARTED', {
        value: 'started',
        writable: false
    });

    /**
     * Constant for notifying application stop
     *
     * @property STOPPED
     * @type String
     * @memberOf core
     */
    Object.defineProperty(self, 'STOPPED', {
        value: 'stopped',
        writable: false
    });

    return  extend(self, {
        type:                       base.type,
        object:                     base.object,
        array:                      base.array,
        log:                        base.log,
        buildSandbox:               buildSandbox,
        notifyApplicationStarted:   notifyApplicationStarted,
        notifyApplicationStopped:   notifyApplicationStopped,
        onApplicationEvent:         onApplicationEvent,
        registerExtension:          registerExtension,
        /**
         * Accesses the current state of the application
         *
         * @memberOf core
         * @return {Boolean} state of the application
         */
        isApplicationRunning: function () { return isApplicationRunning; }

    });

});


/**
 * Application manages the life cycle of modules.
 * @namespace scalejs.application
 * @module application
 */

/*global define*/
define('scalejs.application',[
    'scalejs!core'
], function (
    core
) {
    

    var addOne  = core.array.addOne,
        toArray = core.array.toArray,
        error   = core.log.error,
        debug   = core.log.debug,

        /**
         * Holds modules that have been registered to the application
         * @property moduleRegistrations
         * @type Array
         * @memberOf applciation
         * @private
         */
        moduleRegistrations = [ ],
        /**
         * Holds instances of running modules
         * @property moduleInstances
         * @type Array
         * @memberOf applciation
         * @private
         */
        moduleInstances     = [ ];

    /**
     * Registers a series of modules to the application
     *
     * @param {Function|Object} [module...] modules to register
     * @memberOf application
     */
    function registerModules() {
        // Dynamic module loading is no longer supported for simplicity.
        // Module is free to load any of its resources dynamically.
        // Or an extension can provide dynamic module loading capabilities as needed.
        if (core.isApplicationRunning()) {
            throw new Error('Can\'t register module since the application is already running.',
                            'Dynamic module loading is not supported.');
        }

        Array.prototype.push.apply(moduleRegistrations, toArray(arguments).filter(function (m) { return m; }));
    }

    /**
     * Creates a module instance from the passed framework
     * @private
     *
     * @param {Function|Object} module what to obtain an instance of
     * @memberOf application
     * @return the module instance
     */
    function createModule(module) {
        var moduleInstance,
            moduleId;

        if (typeof module === 'function') {
            try {
                moduleInstance = module();
            } catch (ex) {
                if (module.getId) {
                    moduleId = module.getId();
                } else {
                    moduleId = module.name;
                }

                error('Failed to create an instance of module "' + moduleId + '".',
                      'Application will continue running without the module. ' +
                      'See following exception stack for more details.',
                      ex.stack);
            }
        } else {
            moduleInstance = module;
        }

        addOne(moduleInstances, moduleInstance);

        return moduleInstance;
    }

    /**
     * Creates all modules currently registered to this applciation
     * @private
     *
     * @memberOf application
     */
    function createAll() {
        moduleRegistrations.forEach(createModule);
    }

    /**
     * Starts all of the attached module instances
     * @private
     *
     * @memberOf application
     */
    function startAll() {
        debug('Application started.');

        core.notifyApplicationStarted();
    }

    /**
     * Stops all of the attached module instances
     * @private
     *
     * @memberOf application
     */
    function stopAll() {
        debug('Application exited.');

        core.notifyApplicationStopped();
    }

    /**
     * Launches the application by creating all module instances
     * and launching them all
     *
     * @memberOf application
     */
    function run() {
        createAll();
        startAll();
    }

    /**
     * Exits the application by stopping all running modules
     *
     * @memberOf application
     */
    function exit() {
        stopAll();
    }

    return {
        registerModules:registerModules,
        run:            run,
        exit:           exit
    };

});

/*global define*/
/*jslint unparam:true*/
define('scalejs.sandbox',[],function () {
    

    return {
        load: function (name, req, onLoad, config) {
            req(['scalejs!core', 'scalejs!extensions'], function (core) {
                if (config.isBuild) {
                    onLoad();
                } else {
                    var sandbox = core.buildSandbox(name);
                    onLoad(sandbox);
                }
            });
        }
    };
});
