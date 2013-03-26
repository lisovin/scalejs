/*global require,define,describe,expect,it,console,runs,waits,setTimeout*/
/*jslint nomen:true*/
/// <reference path="../Scripts/jasmine.js"/>
define([
    'scalejs!core'
], function (core) {
    'use strict';

    var builder = core.functional.builder,
        bind = core.functional.builder.bind,
        $bind = core.functional.builder.$bind,
        yieldOne = core.functional.builder.yieldOne,
        yieldMany = core.functional.builder.yieldMany,
        returnValue = core.functional.builder.returnValue,
        $returnValue = core.functional.builder.$returnValue,
        doAction = core.functional.builder.doAction,
        $doAction = core.functional.builder.$doAction,
        $ = core.functional.builder.$;

    describe('functional builder', function () {
        it('empty builder', function () {
            var traceBuilder, 
                trace,
                t;

            traceBuilder = builder({
                bind: function (x, f) {
                    if (x === undefined) {
                        console.log('--->binding with undefined. exiting.');
                        return undefined;
                    }
                    
                    console.log('--->binding with', x, '. continuing.');
                    return f(x());
                },
                returnValue: function (x) {
                    console.log('--->returning', x);
                    return x;
                }
            });

            trace = traceBuilder();

            t = trace(
                $bind('x', function () { return 1; }),
                $bind('y', function () { return 2; }),
                returnValue($(function () {
                    return this.x + this.y;
                }))
            );

            expect(t).toBe(3);
        });

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
                    //var r = v.call(this);
                    return function (complete) {
                        complete(v);
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
                returnValue($(function () {
                    return this.a1 + this.a2;
                }))
            );
            
            var result;

            runs(function () {
                a(function (v) {
                    result = v;
                    console.log('---->result: ', v);
                });
            });

            waits(4000);

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
                /*
                call: function (f) {
                    var r = [];
                    f(function (e) {
                        r.push(e);
                    });
                    return r;
                }*/
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

            expect(lst).toEqual([1, 2, 3, 4, 5, 6]);
            /*
            lst = list(function (yieldOne) {
                var i;
                for (i = 0; i < 10; i += 1) {
                    yieldOne(i);
                }
            });*/
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
                    return x;
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
                    returnValue($('c'))
                );
            }

            expect(safeDivide(12, 2, 3, 2)).toBe(1);
            //expect(safeDivide(12, 2, 0, 2)).not.toBeDefined();
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
                    $returnValue(tryFind(m1)),
                    $returnValue(tryFind(m2)),
                    $returnValue(tryFind(m3))
                );
            }

            expect(multiLookup('2')).toBe('Two');
        });

        it('doActions', function () {
            var traceBuilder, 
                trace,
                t;

            traceBuilder = builder({
                bind: function (x, f) {
                    console.log(f);
                    if (x === undefined) {
                        console.log('--->binding with undefined. exiting.');
                        return undefined;
                    }
                    
                    console.log('--->binding with', x, '. continuing.');
                    return f(x.call(this));
                },
                returnValue: function (x) {
                    console.log('--->returning', x);
                    return x;
                }
            });

            trace = traceBuilder();

            t = trace(
                $bind('x', function () { return 1; }),
                function () {
                    console.log('-->x', this.x);
                },
                $(function () {
                    console.log('--->x', this.x);
                    this.x += 2;
                }),
                function () {
                    this.x += 3;
                },
                returnValue($('x'))
            );

            expect(t).toBe(6);        
        });

        it('state', function () {
            var stateBuilder,
                state,
                s;

            stateBuilder = builder({
                bind: function (x, f) {
                    return function (state) {
                        x(state);
                        var s = f();
                        s(state);
                    };
                },
                /*
                run: function (f) {
                    //console.log(f);

                    var s = {};
                    f(s);
                    return s;
                },*/
                returnValue: function (s) {
                    return s;
                }
            });

            state = stateBuilder();
            /*
            s = state(
                $(function (state) {
                    state.foo = 'bar';
                }),
                $(function (state) {
                    state.bar = 'foo';
                })
            );*/

            //console.log('--->final state', s);

            s = state(
                bind('state', {}),
                function () {
                    this.state.foo = 'bar';
                },
                function (state) {
                    this.state.bar = 'foo';
                }
                //returnValue($('state'))
            );

            console.log('--->final state', s);

        });
    });
});