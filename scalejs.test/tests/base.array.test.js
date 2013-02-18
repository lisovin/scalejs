/*global require,define,describe,expect,it*/
/// <reference path="../Scripts/jasmine.js"/>
define([
    'scalejs!core'
], function (core) {
    'use strict';

    var array = core.array;

    describe('core.array', function () {
        it('is defined', function () {
            expect(array).toBeDefined();
        });

        describe('addOne', function () {
            it('adds an element.', function () {
                var a = [1, 2, 3];
                array.addOne(a, 5);
                expect(a).toEqual([1, 2, 3, 5]);
            });

            it('doesn\'t add duplication element.', function () {
                var a = [1, 5, 3];
                array.addOne(a, 5);
                expect(a).toEqual([1, 5, 3]);
            });
        });
    });
});