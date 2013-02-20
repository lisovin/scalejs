/*global require,define,describe,expect,it*/
/// <reference path="../Scripts/jasmine.js"/>
define([
    'scalejs!core'
], function (core) {
    'use strict';

    describe('`JSON`', function () {
        it('is defined', function () {
            expect(JSON).toBeDefined();
        });

        it('parses json correctly', function () {
            var o = {
                    foo: 1,
                    bar: 'xyz'
                },
                s = "{\"foo\":1,\"bar\":\"xyz\"}";
            expect(JSON.parse(s)).toEqual(o);
        });

        it('serializes json correctly', function () {
            var o = {
                    foo: 1,
                    bar: 'xyz'
                },
                s = "{\"foo\":1,\"bar\":\"xyz\"}";
            expect(JSON.stringify(o)).toBe(s);
        });

        it('throws an exception when trying to parse empty string', function () {
            expect(function () { JSON.parse(''); }).toThrow();
        });

        it('serializes null as "null"', function () {
            expect(JSON.stringify(null)).toEqual("null");
        });

        it('serializes undefined as undefined', function () {
            expect(JSON.stringify(undefined)).toEqual(undefined);
        });
    });
});