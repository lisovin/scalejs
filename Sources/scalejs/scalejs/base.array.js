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
        if (indexOf(array, item) < 0) {
            array.push(item);
        }
    }

    function removeOne(array, item) {
        // Function: removeOne(array, item])
        // Remove the first occurence of an item from the given array.
        // The identity operator === is used for the comparison.
        //
        // Parameters:
        //   array - array, the array to modify in place
        //   item - any, the item to remove
        //
        // Note:
        // Duplicates are not removed.
        var found = indexOf(array, item);
        if (found > -1) {
            array.splice(found, 1);
        }
    }

    function removeAll(array) {
        // Function: removeAll(array)
        // Remove all items from the array.
        array.splice(0, array.length);
    }

    function copy(array, first, count) {
        first = valueOrDefault(first, 0);
        count = valueOrDefault(count, array.length);
        return array.slice(first, count);
    }

    /**
    Executes the supplied function on each item in the array. Iteration stops if the
    supplied function does not return a truthy value.

    @method every
    @param {Array} a the array to iterate.
    @param {Function} f the function to execute on each item.
    @param {Object} [o] Optional context object.
    @return {Boolean} `true` if supplied function doesn't return false for any of the items, `false` otherwise.
    @static
    */
    function iter(array, f, context) {
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
        var i,
            len = array.length,
            results = array.concat();

        for (i = 0; i < len; i += 1) {
            results[i] = f.call(context, array[i], i, array);
        }

        return results;
    }

    function filter(array, f, context) {
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
