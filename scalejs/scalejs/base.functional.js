/*global define,console,document*/
/*jslint nomen: true*/
/**
 * Based on Oliver Steele "Functional Javascript" (http://osteele.com/sources/javascript/functional/)
 **/
define([
    './base.array'
], function (
    array
) {
    'use strict';

    var _ = {};

    function compose() {
        /// <summary>
        /// Returns a function that applies the last argument of this
        /// function to its input, and the penultimate argument to the
        /// result of the application, and so on.
        /// == compose(f1, f2, f3..., fn)(args) == f1(f2(f3(...(fn(args...)))))
        /// :: (a2 -> a1) (a3 -> a2)... (a... -> a_{n}) -> a... -> a1
        /// >> compose('1+', '2*')(2) -> 5
        /// </summary>
        var fns = Array.prototype.slice.call(arguments, 0).reverse();

        return function () {
            var args = fns.reduce(function (args, fn) {
                return [fn.apply(undefined, args)];
            }, Array.prototype.slice.call(arguments));

            return args[0];
        };
    }

    function sequence() {
        /// <summary>
        /// Same as `compose`, except applies the functions in argument-list order.
        /// == sequence(f1, f2, f3..., fn)(args...) == fn(...(f3(f2(f1(args...)))))
        /// :: (a... -> a1) (a1 -> a2) (a2 -> a3)... (a_{n-1} -> a_{n})  -> a... -> a_{n}
        /// >> sequence('1+', '2*')(2) -> 6
        /// </summary>
        var fns = Array.prototype.slice.call(arguments, 0);

        return function () {
            var args = fns.reduce(function (args, fn) {
                return [fn.apply(undefined, args)];
            }, Array.prototype.slice.call(arguments, 0));

            return args[0];
        };
    }

    function bind(object, fn) {
        /// <summary>
        /// Returns a bound method on `object`, optionally currying `args`.
        /// == f.bind(obj, args...)(args2...) == f.apply(obj, [args..., args2...])
        /// </summary>
        /// <param name="object"></param>
        var args = Array.prototype.slice.call(arguments, 2);
        return function () {
            return fn.apply(object, args.concat(Array.prototype.slice.call(arguments, 0)));
        };
    }

    function aritize(fn, n) {
        /// <summary>
        /// Invoking the function returned by this function only passes `n`
        /// arguments to the underlying function.  If the underlying function
        /// is not saturated, the result is a function that passes all its
        /// arguments to the underlying function.  (That is, `aritize` only
        /// affects its immediate caller, and not subsequent calls.)
        /// >> '[a,b]'.lambda()(1,2) -> [1, 2]
        /// >> '[a,b]'.lambda().aritize(1)(1,2) -> [1, undefined]
        /// >> '+'.lambda()(1,2)(3) -> error
        /// >> '+'.lambda().ncurry(2).aritize(1)(1,2)(3) -> 4
        ///
        /// `aritize` is useful to remove optional arguments from a function that
        /// is passed to a higher-order function that supplies *different* optional
        /// arguments.
        ///
        /// For example, many implementations of `map` and other collection
        /// functions, call the function argument with both the collection element
        /// and its position.  This is convenient when expected, but can wreak
        /// havoc when the function argument is a curried function that expects
        /// a single argument from `map` and the remaining arguments from when
        /// the result of `map` is applied.
        /// </summary>
        /// <param name="fn"></param>
        /// <param name="n"></param>
        return function () {
            return fn.apply(undefined, Array.prototype.slice.call(arguments, 0, n));
        };
    }

    function curry(fn, n) {
        if (arguments.length === 1) {
            return curry(fn, fn.length);
        }

        var largs = Array.prototype.slice.call(arguments, 2);

        if (largs.length >= n) {
            return fn.apply(undefined, largs);
        }

        return function () {
            var args = largs.concat(Array.prototype.slice.call(arguments, 0));
            args.unshift(fn, n);
            return curry.apply(undefined, args);
        };
    }

    // partial itself is partial, e.g. partial(_, a, _)(f) = partial(f, a, _)
    function partial() {
        var args = Array.prototype.slice.call(arguments, 0),
            subpos = args.reduce(function (blanks, arg, i) {
                return arg === _ ? blanks.concat([i]) : blanks;
            }, []);

        if (subpos.length === 0) {
            return args[0].apply(undefined, args.slice(1));
        }

        return function () {
            var //specialized = args.concat(Array.prototype.slice.call(arguments, subpos.length)),
                i;

            for (i = 0; i < Math.min(subpos.length, arguments.length); i += 1) {
                args[subpos[i]] = arguments[i];
            }

            return partial.apply(undefined, args);
        };
    }

    function createBuilder() {
        function builder(opts) {
            var build;

            function buildContext() {
                return {};
            }

            function callExpr(context, expr) {
                if (!expr || expr.kind !== '$') {
                    return expr;
                }

                if (typeof expr.expr === 'function') {
                    return expr.expr.call(context);
                }

                if (typeof expr.expr === 'string') {
                    return context[expr.expr];
                }

                throw new Error('Parameter in $(...) must be either a function or a string referencing a binding.');
            }

            function combine(method, context, expr, cexpr) {
                var e = callExpr(context, expr);
                return cexpr.length > 0
                    ? opts.combine(opts[method].call(context, e), build(context, cexpr))
                    : opts[method].call(context, e);
            }

            build = function (context, cexpr) {
                if (cexpr.length === 0) {
                    if (opts.returnValue) {
                        return opts.returnValue();
                    }

                    throw new Error('Computation expression builder must define `return` method.');
                }

                var expr = cexpr.shift();

                if (expr.kind === 'bind') {
                    context[expr.name] = callExpr(context, expr.expr);
                    return build(context, cexpr);
                }

                if (expr.kind === 'do') {
                    expr.expr.call(context);
                    return build(context, cexpr);
                }

                if (expr.kind === '$bind') {
                    return opts.bind.call(context, callExpr(context, expr.expr), function (bound) {
                        context[expr.name] = bound;
                        return build(context, cexpr);
                    });
                }

                if (expr.kind === '$do' || expr.kind === '$') {
                    return opts.bind.call(context, expr.expr.bind(context), function () {
                        return build(context, cexpr);
                    });
                }

                if (expr.kind === 'return') {
                    return combine('returnValue', context, expr.expr, cexpr);
                }

                if (expr.kind === '$return') {
                    return combine('returnValueFrom', context, expr.expr, cexpr);
                }

                if (expr.kind === 'yield') {
                    return combine('yieldOne', context, expr.expr, cexpr);
                }

                if (expr.kind === 'yieldMany') {
                    return combine('yieldMany', context, expr.expr, cexpr);
                }

                return combine('missing', context, expr, cexpr);
            };

            return function () {
                var args = array.copy(arguments),
                    expression = function () {
                        var operations = Array.prototype.slice.call(arguments, 0),
                            context = buildContext(),
                            result;

                        if (this.mixins) {
                            this.mixins.forEach(function (mixin) {
                                if (mixin.beforeBuild) {
                                    mixin.beforeBuild(context, operations);
                                }
                            });
                        }

                        result = build(context, operations);
                        if (opts.run) {
                            result = opts.run.apply(null, [result].concat(args));
                        }

                        if (this.mixins) {
                            this.mixins.forEach(function (mixin) {
                                if (mixin.afterBuild) {
                                    result = mixin.afterBuild(result);
                                }
                            });
                        }

                        return result;
                    };

                function mixin() {
                    var context = {mixins: Array.prototype.slice.call(arguments, 0)},
                        bound = expression.bind(context);
                    bound.mixin = function () {
                        Array.prototype.push.apply(context.mixins, arguments);
                        return bound;
                    };

                    return bound;
                }

                expression.mixin = mixin;

                return expression;
            };
        }

        builder.bind = function (name, expr) {
            return {
                kind: 'bind',
                name: name,
                expr: expr
            };
        };

        builder.$bind = function (name, expr) {
            return {
                kind: '$bind',
                name: name,
                expr: expr
            };
        };

        builder.doAction = function (expr) {
            return {
                kind: 'do',
                expr: expr
            };
        };

        builder.$doAction = function (expr) {
            return {
                kind: '$do',
                expr: expr
            };
        };

        builder.yieldOne = function (expr) {
            return {
                kind: 'yield',
                expr: expr
            };
        };

        builder.returnValue = function (expr) {
            return {
                kind: 'return',
                expr: expr
            };
        };

        builder.$returnValue = function (expr) {
            return {
                kind: '$return',
                expr: expr
            };
        };

        builder.yieldOne = function (expr) {
            return {
                kind: 'yield',
                expr: expr
            };
        };

        builder.yieldMany = function (expr) {
            return {
                kind: 'yieldMany',
                expr: expr
            };
        };

        builder.$ = function (expr) {
            return {
                kind: '$',
                expr: expr
            };
        };

        return builder;
    }

    return {
        _: _,
        compose: compose,
        sequence: sequence,
        bind: bind,
        aritize: aritize,
        curry: curry,
        partial: partial,
        builder: createBuilder()
    };
});
