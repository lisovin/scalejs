/*global define,describe,expect,it*/
/*jslint sloppy: true*/
/// <reference path="../Scripts/jasmine.js"/>
define(['scalejs.mvvm'], function (extension) {
    describe('scalejs.mvvm extension', function () {
        it('of core is defined', function () {
            expect(extension.core).toBeDefined();
        });
    });
});