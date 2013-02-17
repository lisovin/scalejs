/*global require,define,describe,expect,it*/
/*jslint nomen:true*/
/// <reference path="../Scripts/jasmine.js"/>
define([
    'scalejs!core'
], function (core) {
    'use strict';

    var functional = core.functional;

    describe('core.functional', function () {
        it('is defined', function () {
            expect(functional).toBeDefined();
        });

        it('`curry`', function () {
            var curry = functional.curry;

            function test(x, y, z) {
                return x + y + z;
            }

            expect(curry(3, test, 1, 2, 3)).toBe(6);
            expect(curry(3, test)(1, 2, 3)).toBe(6);
            expect(curry(3, test)(1)(2, 3)).toBe(6);
            expect(curry(3)(test)(1)(2)(3)).toBe(6);
        });

        it('`partial`', function () {
            var partial = functional.partial,
                _ = functional._;

            function test(x, y, z) {
                return x + y + z;
            }

            expect(partial(test, 1, 2, 3)).toBe(6);
            expect(partial(test, 1, 2, _)(3)).toBe(6);
            expect(partial(test, 1, _, 3)(2)).toBe(6);
            expect(partial(test, 1, _, _)(2)(3)).toBe(6);
            expect(partial(test, 1, _, _)(2, 3)).toBe(6);
            expect(partial(test, 1, _, _)(2, _)(3)).toBe(6);
            expect(partial(test, _, _, _)(1)(2, 3)).toBe(6);
            expect(partial(_, 1, _, 3)(test, 2)).toBe(6);
        });

        it('`bind`', function () {
            var bind = functional.bind,
                s = 'quick brown fox';

            expect(bind(s, s.indexOf)('fox')).toBe(12);
            expect(bind(s, s.substring)(6, 11)).toBe('brown');
        });

        it('`compose`', function () {
            var compose = functional.compose;

            function f1(x) { return x * 2; }
            function f2(x, y) { return x + y; }

            expect(compose(f1, f2)(1, 2)).toBe(6);

        });

        it('`sequence`', function () {
            var sequence = functional.sequence;

            function f1(x, y) { return x + y; }
            function f2(x) { return x * 2; }

            expect(sequence(f1, f2)(1, 2)).toBe(6);
        });

        it('`bind` + `curry`', function () {
            var bind = functional.bind,
                curry = functional.curry,
                s = 'quick brown fox';

            expect(curry(2)(bind(s, s.substring))(6, 11)).toBe('brown');
        });

        it('`bind` + `partial`', function () {
            var bind = functional.bind,
                partial = functional.partial,
                _ = functional._,
                s = 'quick brown fox';

            expect(partial(bind(s, s.substring), _, 11)(6)).toBe('brown');
            expect(partial(_, 11, _)(bind(s, s.substring))(6)).toBe('brown');
        });
    });
});