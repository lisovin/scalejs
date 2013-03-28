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

    describe('computation expression builder', function () {
        it('with no operations and no `zero` throws an exception.', function () {
            var testBuilder, test, t;

            testBuilder = builder({
            });

            test = testBuilder();

            expect(test).toThrow();
        });

        it('with single operation and no `zero` throws an exception.', function () {
            var testBuilder, test, t;

            testBuilder = builder({
            });

            test = testBuilder();

            expect(function () {
                test(
                    console.log('testing...')
                );
            }).toThrow();
        });

        it('with no operations and defined `zero` returns "zero" value.', function () {
            var testBuilder, test, t;

            testBuilder = builder({
                zero: function () {
                    return 5;
                }
            });

            test = testBuilder();

            expect(test()).toBe(5);
        });

        it('with single JS expresion calls it and returns "zero" value.', function () {
            var testBuilder, test, t, op = jasmine.createSpy();

            testBuilder = builder({
                zero: function () {
                    return 1;
                }
            });

            test = testBuilder();

            expect(test(op)).toBe(1);
            expect(op).toHaveBeenCalled();
        });

        it('with multiple JS expressions calls them and returns "zero" value.', function () {
            var testBuilder, test, t, op = jasmine.createSpy();

            testBuilder = builder({
                zero: function () {
                    return 'test';
                }
            });

            test = testBuilder();

            expect(test(op, op, op)).toBe('test');
            expect(op.callCount).toBe(3);
        });

        it('bound value can be referenced in JS expressions.', function () {
            var testBuilder, test, t, op = jasmine.createSpy();

            testBuilder = builder({
                zero: function () {
                    return 'test';
                }
            });

            test = testBuilder();

            expect(test(
                bind('foo', 5),
                function () { op(this.foo); })).toBe('test');
            expect(op).toHaveBeenCalledWith(5);
        });

        it('bound value can be referenced in JS expressions.', function () {
            var testBuilder, test, t, op = jasmine.createSpy();

            testBuilder = builder({
                zero: function () {
                    return 'test';
                }
            });

            test = testBuilder();

            expect(test(
                bind('foo', 5),
                function () { op(this.foo); })).toBe('test');
            expect(op).toHaveBeenCalledWith(5);
        });

        it('bound value can be referenced in JS expressions.', function () {
            var testBuilder, test, t, op = jasmine.createSpy();

            testBuilder = builder({
                zero: function () {
                    return 'test';
                }
            });

            test = testBuilder();

            expect(test(
                bind('foo', 5),
                function () { op(this.foo); })).toBe('test');
            expect(op).toHaveBeenCalledWith(5);
        });

        it('with "returnValue" operation but no `returnValue` defined on the builder throws an exception.', function () {
            var testBuilder, test;

            testBuilder = builder({
            });

            test = testBuilder();

            expect(function () { test(returnValue(5)); }).toThrow();
        });

        it('with "returnValue" operation and `returnValue` defined on the builder returns the value.', function () {
            var testBuilder, test;

            testBuilder = builder({
                returnValue: function (x) {
                    return x;
                }
            });

            test = testBuilder();

            expect(test(returnValue(5))).toBe(5);
            expect(test(
                bind('x', 10),
                returnValue($('x'))
            )).toBe(10);
        });

        it('with multiple "returnValue" operations but no `combine` defined on the builder throws an exception.', function () {
            var testBuilder, test;

            testBuilder = builder({
                returnValue: function (x) {
                    return x;
                }
            });

            test = testBuilder();

            expect(function () {
                test(
                    returnValue(5),
                    returnValue('test')
                );
            }).toThrow();
        });

        it('with multiple "returnValue" operations but no `delay` defined on the builder throws an exception.', function () {
            var testBuilder, test;

            testBuilder = builder({
                combine: function (x, y) {
                    return x;
                },

                returnValue: function (x) {
                    return x;
                }
            });

            test = testBuilder();

            expect(function () {
                test(
                    returnValue(5),
                    returnValue('test')
                );
            }).toThrow();
        });

        it('with multiple "returnValue" operations but no `run` defined returns a function that evaluates to correct value.', function () {
            var testBuilder, test, t;

            testBuilder = builder({
                delay: function (f) {
                    return f;
                },

                combine: function (x, f) {
                    if (x === 5) {
                        return x;
                    }

                    return f();
                },

                returnValue: function (x) {
                    console.log('--->returnValue:', x);
                    return x;
                }
            });

            test = testBuilder();
            t = test(
                returnValue('foo'),
                returnValue(5),
                returnValue('test')
            );

            expect(typeof t).toBe('function');
            expect(t()).toBe(5);
        });

        it('with multiple "returnValue" operations evaluates to correct value.', function () {
            var testBuilder, test, t;

            testBuilder = builder({
                delay: function (f) {
                    return f;
                },

                run: function (f) {
                    return f();
                },

                combine: function (x, f) {
                    if (x === 5) {
                        return x;
                    }

                    return f();
                },

                returnValue: function (x) {
                    console.log('--->returnValue:', x);
                    return x;
                }
            });

            test = testBuilder();
            t = test(
                returnValue('foo'),
                returnValue(5),
                returnValue('test')
            );

            expect(t).toBe(5);
        });

        it('bound value with "$bind" can be referenced.', function () {
            var asyncBuilder, async, complete = jasmine.createSpy(), start = new Date().getTime();

            // async
            asyncBuilder = builder({
                bind: function (x, f) {
                    // every x is function (completed) {...} where completed is function (result) {...}
                    // (e.g. M<T> = (T -> unit) -> unit)
                    // Therefore to bind we pass result of x into f which would return "completable" funciton.
                    // Then we simply pass completed into that function and we are done.
                    return function (completed) {
                        return x(function (xResult) {
                            var inner = f(xResult);
                            inner(completed);
                        });
                    };
                },
                
                run: function (f) {
                    var r = f;
                    /*var r = function (complete) {
                        var v = f();
                        complete(v);
                    };*/

                    r.timeout = function(n) {
                        return function (complete) {
                            setTimeout(function () {
                                r(complete);
                            }, n);
                        };
                    };

                    return r;
                },

                returnValue: function (x) {
                    // convert T to M<T>
                    return function (complete) {
                        console.log('--->returnValue:', x, ((new Date()).getTime() - start));
                        complete(x);
                    };
                }
            });

            async = asyncBuilder();
            
            var a = async(
                $bind('x', async(returnValue($(function () { return 2; }))).timeout(20)),
                $bind('y', async(returnValue($(function () { return 3; }))).timeout(20)),
                returnValue($(function () {
                    return this.x + this.y;
                }))
            );

            a(complete);

            waits(50);

            runs(function () {
                expect(complete).toHaveBeenCalledWith(5);
            });
        });
    }),

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

        it('interceptor', function () {
            var stateBuilder,
                state,
                s,
                interceptor;

            interceptor = {
                beforeBuild: function (ctx, ops) {
                    console.log('--->INTERCEPTED!', ops);
                },
                afterBuild: function (state) {
                    state.intercepted = 'yes';
                    return state;
                }
            }

            stateBuilder = builder({
                run: function (f) {
                    var s = {};
                    f(s);
                    return s;
                },

                combine: function (f, g) {
                    return function (state) {
                        f(state);
                        g(state);
                    };
                },

                missing: function (expr) {
                    if (typeof expr === 'function') {
                        return expr;
                    }
                }
            });

            var state1 = stateBuilder();
            var state2 = state1.mixin(interceptor);
            
            s = state2(
                function (state) {
                    state.foo = 'bar';
                },
                function (state) {
                    state.bar = 'foo';
                }
            );

            console.log('--->final state', s);

        });
    });
});