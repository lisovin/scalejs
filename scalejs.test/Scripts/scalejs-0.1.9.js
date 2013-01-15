
/*global define,window */
define('scalejs',[],function () {
    

    var isExtensionsRegistered = false,
        windowType = typeof (window);


    // IE weirdness. 
    if (windowType !== 'undefined' && window.console === 'undefined') {
        window.console = window.Console;
    }

    return {
        load: function (name, req, load, config) {
            var extensionNames = config.scalejs ? config.scalejs.extensions || [] : [],
                moduleName = 'scalejs/' + name;

            req([moduleName], function (loadedModule) {
                if (moduleName === 'scalejs/application') {
                    req(extensionNames, function () {
                        var extensions = arguments;
                        // it's possible that core was not loaded by any of the extensions, so ensure it's loaded
                        req(['scalejs/core'], function (core) {
                            if (!config.isBuild && !isExtensionsRegistered) {
                                core.array.iter(extensions, function (extension, i) {
                                    if (extension !== undefined && extension !== null) {
                                        extension.scalejsId = extensionNames[i];
                                        core.registerExtension(extension);
                                    }
                                });
                                core.buildCore();
                                isExtensionsRegistered = true;
                            }

                            load(loadedModule);
                        });
                    });
                } else {
                    load(loadedModule);
                }
            });
        }
    };
});

/*global define,console,document*/
define('scalejs/base.type',[],function () {
    
    function typeOf(obj) {
        return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    }

    function is(value) {
        // Function: is([...,]value[,type]): boolean
        // Check the type of a value, possibly nested in sub-properties.
        //
        // The method may be called with a single argument to check that the value
        // is neither null nor undefined.
        //
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
        // Parameters:
        //   ...   - any, optional, a chain of parent properties for a nested value
        //   value - any, the value to check, which may be nested in a chain made
        //           of previous arguments (see above)
        //   type - string, optional, the type expected for the value.
        //          Alternatively, a constructor function may be provided to check
        //          whether the value is an instance of given constructor.
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
        // Type Reference:
        //   'undefined' - undefined
        //   'null'      - null
        //   'boolean'   - false, true
        //   'number'    - -1, 0, 1, 2, 3, Math.sqrt(2), Math.E, Math.PI...
        //   'string'    - '', 'abc', "Text!?"...
        //   'array'     - [], [1,2,3], ['a',{},3]...
        //   'object'    - {}, {question:'?',answer:42}, {a:{b:{c:3}}}...
        //   'regexp'    - /abc/g, /[0-9a-z]+/i...
        //   'function'  - function(){}, Date, setTimeout...
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
        //
        var undef, // do not trust global undefined, which may be overridden
            i,
            length = arguments.length,
            last = length - 1,
            type,
            typeOfType,
            internalClass,
            v = value;


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
        is : is,
        typeOf : typeOf
    };
});

/*global define,console,document*/
define('scalejs/base.object',[
    './base.type'
], function (
    type
) {
    

    var is = type.is;

    function has(object) {
        // Function: has(obj,property[,...]): boolean
        // Check whether an obj property is present and not null nor undefined.
        //
        // A chain of nested properties may be checked by providing more than two
        // arguments.
        //
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
        // Parameters:
        //   obj - any, an obj or any other value
        //   property - string, the name of the property to look up
        //   ...      - string, additional property names to check in turn
        //
        // Returns:
        //   * false if no argument is provided or if the obj is null or
        //     undefined, whatever the number of arguments
        //   * true if the full chain of nested properties is found in the obj
        //     and the corresponding value is neither null nor undefined
        //   * false otherwise
        var i,
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

    function mix(receiver, supplier) {
        var p;
        for (p in supplier) {
            if (supplier.hasOwnProperty(p)) {
                if (has(supplier, p) &&
                        supplier[p].constructor === Object &&
                            has(receiver, p)) {
                    receiver[p] = mix(receiver[p], supplier[p]);
                } else {
                    receiver[p] = supplier[p];
                }
            }
        }

        return receiver;
    }

    function merge() {
        var args = arguments,
            i,
            len = args.length,
            result = {};

        for (i = 0; i < len; i += 1) {
            mix(result, args[i]);
        }

        return result;
    }

    function clone(o) {
        return merge({}, o);
    }

    function extend(receiver, extension, path) {
        var props = has(path) ? path.split('.') : [],
            target = receiver,
            i;

        for (i = 0; i < props.length; i += 1) {
            if (!has(target, props[i])) {
                target[props[i]] = {};
            }
            target = target[props[i]];
        }

        mix(target, extension);

        return target;
    }

    function valueOrDefault(value, defaultValue) {
        return has(value) ? value : defaultValue;
    }

    return {
        has: has,
        valueOrDefault: valueOrDefault,
        merge: merge,
        extend: extend,
        clone: clone
    };
});

/*global define,console,document*/
define('scalejs/base.array',[
    './base.type',
    './base.object'
], function (
    type,
    object
) {
    

    var is = type.is,
        valueOrDefault = object.valueOrDefault;

    function indexOf(array, item) {
        /// <summary>
        /// Return the first index at which a given item can be found in the array, 
        /// or -1 if it is not present.
        /// </summary>
        /// <param name="array">Array to locate the item in.</param>
        /// <param name="item">Item to locate in the array.</param>
        /// <returns type="int">The first index at which a given item can be found in 
        /// the array, or -1 if it is not present.</returns>
        if (is(array, 'indexOf', 'function')) {
            return array.indexOf(item);
        }

        var len = array.length,
            from;

        for (from = 0; from < len; from += 1) {
            if (array[from] === item) {
                return from;
            }
        }

        return -1;
    }

    function addOne(array, item) {
        /// <summary>
        /// Add an item to the array if it doesn't exist.
        /// </summary>
        /// <param name="array">Array to add the item to.</param>
        /// <param name="item">Item to add to the array.</param>
        if (indexOf(array, item) < 0) {
            array.push(item);
        }
    }

    function removeOne(array, item) {
        /// <summary>
        /// Remove the first occurence of an item from the given array.
        /// The identity operator === is used for the comparison.
        /// <param name="array">Array to remove the item from (in place).</param>
        /// <param name="item">The item to remove from the array.</param>
        var found = indexOf(array, item);
        if (found > -1) {
            array.splice(found, 1);
        }
    }

    function removeAll(array) {
        /// <summary>
        /// Remove all items from the array
        /// </summary>
        /// <param name="array">Array to remove items from (in place).</param>
        array.splice(0, array.length);
    }

    function copy(array, first, count) {
        /// <summary>
        /// Return the specified items of the array as a new array.
        /// </summary>
        /// <param name="array">Array to return items from.</param>
        /// <param name="first">Index of the first item to include into 
        /// the result array (0 if not specified).</param>
        /// <param name="count">Number of items to include into the result 
        /// array (length of the array if not specified).</param>
        /// <returns type="">New array containing the specified items.</returns>
        first = valueOrDefault(first, 0);
        count = valueOrDefault(count, array.length);
        return array.slice(first, count);
    }

    function iter(array, f, context) {
        /// <summary>
        /// Executes the supplied function on each item in the array. Iteration stops if the
        /// supplied function does not return a truthy value.
        /// </summary>
        /// <param name="array">Array to iterate.</param>
        /// <param name="f">Function to execute on each item.</param>
        /// <param name="context">Optional context object.</param>
        /// <returns type="">`true` if supplied function doesn't return false for
        /// any of the items, `false` otherwise.</returns>
        var i,
            l = array.length,
            v;

        for (i = 0; i < l; i += 1) {
            v = f.call(context, array[i], i, array);
            if (v === false) {
                return false;
            }
        }

        return true;
    }

    function map(array, f, context) {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="array"></param>
        /// <param name="f"></param>
        /// <param name="context"></param>
        /// <returns type=""></returns>
        var i,
            len = array.length,
            results = array.concat();

        for (i = 0; i < len; i += 1) {
            results[i] = f.call(context, array[i], i, array);
        }

        return results;
    }

    function filter(array, f, context) {
        /// <summary>
        /// <p>Create a new array from a subset of items as determined by the 
        /// boolean function passed as the argument.</p>
        /// 
        /// <p>The filter function signature is <code>condition(item )</code>.</p>
        /// </summary>
        /// <param name="array">Array to filter.</param>
        /// <param name="f">Filter function.</param>
        /// <param name="context">Optional context.</param>
        /// <returns type="array">New array.</returns>
        var i,
            len     = array.length,
            results = [],
            item;

        for (i = 0; i < len; i += 1) {
            item = array[i];

            if (f.call(context, item, i, array)) {
                results.push(item);
            }
        }

        return results;
    }

    function find(array, f, context) {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="array"></param>
        /// <param name="f"></param>
        /// <param name="context"></param>
        /// <returns type=""></returns>
        var i,
            l;
        for (i = 0, l = array.length; i < l; i += 1) {
            if (array.hasOwnProperty(i) && f.call(context, array[i], i, array)) {
                return array[i];
            }
        }
        return null;
    }

    return {
        addOne: addOne,
        removeOne: removeOne,
        removeAll: removeAll,
        copy: copy,
        indexOf: indexOf,
        iter : iter,
        map: map,
        filter: filter,
        find: find
    };
});

/*global define,console,document*/
define('scalejs/base.dom',[],function () {
    

    function $(id) {
        return document.getElementById(id);
    }

    function appendElementHtml(domElement, html) {
        var div = document.createElement('div'),
            n;

        div.innerHTML = html;

        for (n = 0; n < div.childNodes.length; n += 1) {
            domElement.appendChild(div.childNodes[n].cloneNode(true));
        }
    }

    function createElement(name, attributes) {
        var elName = name,
            el,
            p;
        // convert name to uppercase to ensure cross-browser consistency
        // (IE keeps original case for unknown nodeName/tagName)
        if (name && name.toUpperCase) {
            elName = name.toUpperCase();
        }
        el = document.createElement(elName);

        // set attributes
        for (p in attributes) {
            if (attributes.hasOwnProperty(p)) {
                el.setAttribute(p, attributes[p]);
            }
        }
        return el;
    }


    return {
        $: $,
        createElement: createElement,
        appendElementHtml: appendElementHtml
    };
});

/*global define,console,document*/
define('scalejs/base.log',[
    './base.object'
], function (
    object
) {
    

    var has = object.has;

    function formatException(ex) {
        var stack = has(ex, 'stack') ? String(ex.stack) : '',
            message = has(ex, 'message') ? ex.message : '';
        return 'Error: ' + message + '\nStack: ' + stack;
    }

    function info(message) {
        if (has(console)) {
            console.info(message);
        }
    }

    function warn(message) {
        if (has(console)) {
            console.warn(message);
        }
    }

    function error(message) {
        if (has(console)) {
            console.error(message);
        }
    }

    function debug(message) {
        if (has(console)) {
            if (has(console, 'debug')) {
                console.debug(message);
            } else {
                info(message);
            }
        }
    }

    return {
        info: info,
        warn: warn,
        debug: debug,
        error: error,
        formatException: formatException
    };
});

/*
 * Minimal base implementation. 
 */
/*global define,console,document*/
define('scalejs/base',[
    './base.array',
    './base.dom',
    './base.log',
    './base.object',
    './base.type'
], function (
    array,
    dom,
    log,
    object,
    type
) {
    

    return {
        array: array,
        dom: dom,
        log: log,
        object: object,
        type: type
    };
});

/*global define,document */
define('scalejs/sandbox',[
    'require'
], function (
    require
) {
    

    function Sandbox(id, core, containerElement) {
        var has = core.object.has,
            is = core.type.is,
        //warn = core.log.warn,
            $ = core.dom.$,
            createElement = core.dom.createElement,
            box,
            dom;

        function getId() {
            return id;
        }

        function getBox() {
            if (has(box)) {
                return box;
            }

            box = $(id);
            if (!has(box)) {
                if (has(containerElement)) {
                    containerElement.setAttribute('id', id);
                    box = containerElement;
                } else {
                    box = createElement('div', { 'id': id });
                    document.body.appendChild(box);
                }
            }

            return box;
        }

        function loadModule(path, params) {
            require(
                ['scalejs/application', path],
                function (application, module) {
                    application.registerModule(module, params, getBox());
                }
            );
        }

        function appendHtml(html) {
            var myBox = getBox();
            core.dom.appendElementHtml(myBox, html);
        }

        dom = core.object.merge(core.dom, {
            appendHtml: appendHtml
        });
        delete dom.appendElementHtml;

        return {
            getId: getId,
            getBox: getBox,
            has: has,
            is: is,
            loadModule: loadModule,
            object: core.object,
            log: core.log,
            array: core.array,
            dom: dom
        };
    }

    return Sandbox;
});

/*global define */
define('scalejs/core',[
    './base',
    './sandbox'
],
    function (
        base,
        Sandbox
    ) {
        
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

/*
 * Core Application
 *
 * The Core Application manages the life cycle of modules.
 */
/*global define,window */
define('scalejs/application',[
    './core'
], function (
    core
) {
    

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

/*
 * Core Module of Scalable JavaScript Application
 *
 * Each Module corresponds to an independent unit of functionality.
 */
/*global define */
define('scalejs/module',[
    './core'
], function (
    core
) {
    

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
                //sandbox.dom.removeAllListeners();
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
