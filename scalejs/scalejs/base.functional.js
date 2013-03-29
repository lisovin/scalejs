/*global define,console,document*/
/*jslint nomen: true*/
/**
 * Based on Oliver Steele "Functional Javascript" (http://osteele.com/sources/javascript/functional/)
 **/
define([
    './base.object',
    './base.array'
], function (
    object,
    array
) {
    'use strict';

    var merge = object.merge,
        _ = {};

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
                function isReturnLikeMethod(method) {
                    return method === '$return' ||
                           method === '$RETURN' ||
                           method === '$yield' ||
                           method === '$YIELD';
                }

                if (typeof opts[method] !== 'function') {
                    throw new Error('This control construct may only be used if the computation expression builder ' +
                                    'defines a `' + method + '` method.');
                }

                var e = callExpr(context, expr);

                if (cexpr.length > 0) {
                    if (typeof opts.combine !== 'function') {
                        throw new Error('This control construct may only be used if the computation expression builder ' +
                                        'defines a `combine` method.');
                    }
                    // if it's not a return then simply combine the operations (e.g. no `delay` needed)
                    if (!isReturnLikeMethod(method)) {
                        if (method === '$for') {
                            return opts.combine(opts.$for(expr.items, function (item) {
                                var cexpr = array.copy(expr.cexpr),
                                    ctx = merge(context);
                                ctx[expr.name] = item;
                                return build(ctx, cexpr);
                            }), build(context, cexpr));
                        }

                        return opts.combine(opts[method].call(context, e), build(context, cexpr));
                    }

                    if (typeof opts.delay !== 'function') {
                        throw new Error('This control construct may only be used if the computation expression builder ' +
                                        'defines a `delay` method.');
                    }


                    // combine with delay
                    return opts.combine(opts[method].call(context, e), opts.delay.call(context, function () {
                        return build(context, cexpr);
                    }));
                }

                // if it's return then simply return
                if (isReturnLikeMethod(method)) {
                    return opts[method].call(context, e);
                }

                // combine non-return operation with `zero`                
                return opts.combine(opts[method].call(context, e), build(context, cexpr));
            }

            if (!opts.missing) {
                opts.missing = function (expr) {
                    if (expr.kind) {
                        throw new Error('Unknown operation "' + expr.kind + '". ' +
                                        'Either define `missing` method on the builder or fix the spelling of the operation.');
                    }

                    throw new Error('Expression ' + JSON.stringify(expr) + ' cannot be processed. ' +
                                    'Either define `missing` method on the builder or convert expression to a function.');
                };
            }

            build = function (context, cexpr) {
                if (cexpr.length === 0) {
                    if (opts.zero) {
                        return opts.zero();
                    }

                    throw new Error('Computation expression builder must define `zero` method.');
                }

                var expr = cexpr.shift();

                if (expr.kind === 'let') {
                    context[expr.name] = callExpr(context, expr.expr);
                    return build(context, cexpr);
                }

                if (expr.kind === 'do') {
                    expr.expr.call(context);
                    return build(context, cexpr);
                }

                if (expr.kind === 'letBind') {
                    return opts.bind.call(context, callExpr(context, expr.expr), function (bound) {
                        context[expr.name] = bound;
                        return build(context, cexpr);
                    });
                }

                if (expr.kind === 'doBind' || expr.kind === '$') {
                    return opts.bind.call(context, expr.expr.bind(context), function () {
                        return build(context, cexpr);
                    });
                }

                if (expr.kind === '$return' ||
                        expr.kind === '$RETURN' ||
                        expr.kind === '$yield' ||
                        expr.kind === '$YIELD') {
                    return combine(expr.kind, context, expr.expr, cexpr);
                }

                if (expr.kind === '$for') {
                    return combine('$for', context, expr, cexpr);
                }

                if (typeof expr === 'function' && opts.call) {
                    opts.call(context, expr);
                    return build(context, cexpr);
                }

                if (typeof expr === 'function') {
                    expr.call(context, expr);
                    return build(context, cexpr);
                }

                return combine('missing', context, expr, cexpr);
            };

            return function () {
                var args = array.copy(arguments),
                    expression = function () {
                        var operations = Array.prototype.slice.call(arguments, 0),
                            context = buildContext(),
                            result,
                            toRun;

                        if (this.mixins) {
                            this.mixins.forEach(function (mixin) {
                                if (mixin.beforeBuild) {
                                    mixin.beforeBuild(context, operations);
                                }
                            });
                        }

                        if (opts.delay) {
                            toRun = opts.delay(function () {
                                return build(context, operations);
                            });
                        } else {
                            toRun = build(context, operations);
                        }

                        if (opts.run) {
                            result = opts.run.apply(null, [toRun].concat(args));
                        } else {
                            result = toRun;
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

        builder.$let = function (name, expr) {
            return {
                kind: 'let',
                name: name,
                expr: expr
            };
        };

        builder.$LET = function (name, expr) {
            return {
                kind: 'letBind',
                name: name,
                expr: expr
            };
        };

        builder.$do = function (expr) {
            return {
                kind: 'do',
                expr: expr
            };
        };

        builder.$DO = function (expr) {
            return {
                kind: 'doBind',
                expr: expr
            };
        };

        builder.$return = function (expr) {
            return {
                kind: '$return',
                expr: expr
            };
        };

        builder.$RETURN = function (expr) {
            return {
                kind: '$RETURN',
                expr: expr
            };
        };

        builder.$yield = function (expr) {
            return {
                kind: '$yield',
                expr: expr
            };
        };

        builder.$YIELD = function (expr) {
            return {
                kind: '$YIELD',
                expr: expr
            };
        };

        builder.$for = function (name, items) {
            var cexpr = Array.prototype.slice.call(arguments, 2);

            return {
                kind: '$for',
                name: name,
                items: items,
                cexpr: cexpr
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
