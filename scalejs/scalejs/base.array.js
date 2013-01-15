/*global define,console,document*/
define([
    './base.type',
    './base.object'
], function (
    type,
    object
) {
    'use strict';

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
