/**
 * Provides array functionality to scalejs base
 * @namespace scalejs.base
 * @module array
 */

/*global define*/
define([
    './base.object'
], function (
    object
) {
    'use strict';

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
        copy(list, start, count);

        /*ignore jslint start*
        var array = [],
            i,
            result;

        for (i = list.length; i--; array[i] = list[i]) { }

        result = copy(array, start, count);

        return result;
        *ignore jslint end*/
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
