/**
 * Provides object functionality to scalejs base
 * @namespace scalejs.base
 * @module object
 */

/*global define*/
define([
    './scalejs.base.type'
], function (
    type
) {
    'use strict';

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
