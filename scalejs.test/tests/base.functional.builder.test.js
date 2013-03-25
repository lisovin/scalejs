/*global require,define,describe,expect,it,console,runs,waits,setTimeout*/
/*jslint nomen:true*/
/// <reference path="../Scripts/jasmine.js"/>
define([
    'scalejs!core'
], function (core) {
    'use strict';

    var builder = core.functional.builder,
        $bind = core.functional.builder.$bind,
        bound = core.functional.builder.bound,
        yieldOne = core.functional.builder.yieldOne,
        yieldMany = core.functional.builder.yieldMany,
        returnValue = core.functional.builder.returnValue,
        $return = core.functional.builder.$return;

    describe('functional builder', function () {
        it('async builder', function () {
            var asyncBuilder,
                async;
            
            asyncBuilder = builder({
                bind: function (v, f) {
                    return function(complete) {
                        v(function (r) {
                            var fv = f(r);
                            fv(complete);
                        });
                    }
                },
                returnValue: function (v) {
                    var r = v.call(this);
                    return function (complete) {
                        complete(r);
                    }
                },
                expression: function (f) {
                    f();
                }
            });

            async = asyncBuilder();

            function returnLater(s, f) {
                return function(complete) {
                    setTimeout(function () {
                        var v = f();
                        complete(v);
                    }, s * 1000);
                };
            }

            var a = async(
                $bind('a1', returnLater(1, function () { return 2; })),
                $bind('a2', returnLater(2, function () { return 3; })),
                /*
                call(function () {
                    console.log('--->in async: ', this.a1, this.a2);
                }),*/
                returnValue(function () {
                    return this.a1 + this.a2;
                })
            );
            
            var result;

            runs(function () {
                a(function (v) {
                    result = v;
                    console.log('---->result: ', v);
                });
            });

            waits(3000);

            runs(function () {
                expect(result).toBe(5);
            });
        });

        it('list builder', function () {
            var listBuilder,
                list,
                lst;

            listBuilder = builder({
                yieldOne: function (x) {
                    return [x];
                },

                yieldMany: function (xs) {
                    return xs;
                },

                combine: function (x, y) {
                    return x.concat(y);
                }
            });

            list = listBuilder();

            lst = list(
                yieldOne(1),
                yieldOne(2),
                yieldMany([3,4,5]),
                /*forEach([1,2,3], function (x) {
                    yieldOne(x);
                }),*/
                yieldOne(6)
            );

            console.log('--->lst:', lst);
        });

        it('maybe builder', function () {
            var maybeBuilder,
                maybe,
                m;

            maybeBuilder = builder({
                bind: function (x, f) {
                    var v = x.call(this);
                    console.log('--->v: ', v);

                    if (v === undefined) {
                        return undefined;
                    } 
                    
                    return f(v);
                },
                
                returnValue: function (x) {
                    return x.call(this);
                }
            });

            maybe = maybeBuilder();

            function divideBy(x, y) {
                return function () {
                    if (y === 0) {
                        return undefined;
                    }

                    if (typeof x === 'string') {
                        return this[x] / y;
                    }

                    return x / y;
                };
            }

            function safeDivide(n, x, y, z) {
                return maybe (
                    $bind('a', divideBy(n, x)),
                    $bind('b', divideBy('a', y)),
                    $bind('c', divideBy('b', z)),
                    returnValue(bound('c'))
                );
            }

            expect(safeDivide(12, 2, 3, 2)).toBe(1);
            expect(safeDivide(12, 2, 0, 2)).not.toBeDefined();
        });

        it('orElse', function () {
            var orElseBuilder,
                orElse,
                m1 = { '1': 'One' },
                m2 = { '2': 'Two' },
                m3 = { '3': 'Three' };

            orElseBuilder = builder({
                returnValueFrom: function (x) {
                    console.log('-->returning ', x);
                    return x;
                },
                combine: function (x, y)  {
                    return x === undefined ? y : x;
                }
            });

            orElse = orElseBuilder();

            function multiLookup(key) {
                function tryFind(m) {
                    return m[key];
                }

                return orElse(
                    $return(tryFind(m1)),
                    $return(tryFind(m2)),
                    $return(tryFind(m3))
                );
            }

            expect(multiLookup('2')).toBe('Two');
        });
    });
});