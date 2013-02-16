/*global define,console,document*/
/*jslint nomen: true*/
/**
 * Based on Oliver Steele "Functional Javascript" (http://osteele.com/sources/javascript/functional/)
 **/
define([], function (
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
        var fns = Array.prototype.slice.call(arguments, 0);
        return function () {
            var args = Array.prototype.reverse.call(arguments);
            fns.reduce(function (args, fn) {
                return [fn.apply(undefined, args)];
            });

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
            var args = Array.prototype.slice.call(arguments, 0);
            fns.reduce(function (args, fn) {
                return [fn.apply(undefined, args)];
            }, args);

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

    function saturate(fn) {
        /// <summary>
        /// Returns a function that applies the underlying function to `args`, and
        /// ignores its own arguments.
        /// :: (a... -> b) a... -> (... -> b)
        /// == f.saturate(args...)(args2...) == f(args...)
        /// >> Math.max.curry(1, 2)(3, 4) -> 4
        /// >> Math.max.saturate(1, 2)(3, 4) -> 2
        /// >> Math.max.curry(1, 2).saturate()(3, 4) -> 2
        /// </summary>
        /// <param name="fn"></param>
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(undefined, args);
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

    function curry(fn) {
        /// <summary>
        /// Returns a function that, applied to an argument list $arg2$,
        /// applies the underlying function to $args ++ arg2$.
        /// :: (a... b... -> c) a... -> (b... -> c)
        /// == f.curry(args1...)(args2...) == f(args1..., args2...)
        ///
        /// Note that, unlike in languages with true partial application such as Haskell,
        /// `curry` and `uncurry` are not inverses.  This is a repercussion of the
        /// fact that in JavaScript, unlike Haskell, a fully saturated function is
        /// not equivalent to the value that it returns.  The definition of `curry`
        /// here matches semantics that most people have used when implementing curry
        /// for procedural languages.
        ///
        /// This implementation is adapted from
        /// [http://www.coryhudson.com/blog/2007/03/10/javascript-currying-redux/].
        /// </summary>
        /// <param name="fn"></param>

        var args = Array.prototype.slice.call(arguments, 1);

        return function () {
            return fn.apply(undefined, args.concat(Array.prototype.slice.call(arguments, 0)));
        };
    }

    function rcurry(fn) {
        /// <summary>
        /// Right curry.  Returns a function that, applied to an argument list $args2$,
        /// applies the underlying function to $args2 + args$.
        /// == f.curry(args1...)(args2...) == f(args2..., args1...)
        /// :: (a... b... -> c) b... -> (a... -> c)
        /// </summary>
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(undefined, Array.prototype.slice.call(arguments, 0).concat(args));
        };
    }

    function ncurry(fn, n) {
        /// <summary>
        /// Same as `curry`, except only applies the function when all
        /// `n` arguments are saturated.
        /// </summary>
        /// <param name="fn"></param>
        /// <param name="n"></param>
        var largs = Array.prototype.slice.call(arguments, 2);
        return function () {
            var args = largs.concat(Array.prototype.slice.call(arguments, 0));
            if (args.length < n) {
                args.unshift(fn, n);
                return ncurry.apply(undefined, args);
            }
            return fn.apply(undefined, args);
        };
    }

    function rncurry(fn, n) {
        /// <summary>
        /// Same as `rcurry`, except only applies the function when all
        /// `n` arguments are saturated.
        /// </summary>
        /// <param name="fn"></param>
        /// <param name="n"></param>
        var rargs = Array.prototype.slice.call(arguments, 2);
        return function () {
            var args = Array.prototype.slice.call(arguments, 0).concat(rargs);
            if (args.length < n) {
                args.unshift(fn, n);
                return rncurry.apply(undefined, args);
            }
            return fn.apply(undefined, args);
        };
    }

    function partial(fn) {
        /// <summary>
        ///  Returns a function $f$ such that $f(args2)$ is equivalent to
        ///  the underlying function applied to a combination of $args$ and $args2$.
        /// 
        ///  `args` is a partially-specified argument: it's a list with "holes",
        ///  specified by the special value `_`.  It is combined with $args2$ as
        ///  follows:
        /// 
        ///  From left to right, each value in $args2$ fills in the leftmost
        ///  remaining hole in `args`.  Any remaining values
        ///  in $args2$ are appended to the result of the filling-in process
        ///  to produce the combined argument list.
        /// 
        ///  If the combined argument list contains any occurrences of `_`, the result
        ///  of the application of $f$ is another partial function.  Otherwise, the
        ///  result is the same as the result of applying the underlying function to
        ///  the combined argument list.
        /// </summary>
        /// <param name="fn">Underlying function.</param>
        /// <returns type="">Result function.</returns>

        var args = Array.prototype.slice.call(arguments, 1),
            //substitution positions
            subpos = args.reduce(function (blanks, arg, i) {
                return arg === _ ? blanks.concat([i]) : blanks;
            }, []);

        return function () {
            var specialized = args.concat(Array.prototype.slice.call(arguments, subpos.length)),
                i;

            for (i = 0; i < Math.min(subpos.length, arguments.length); i += 1) {
                specialized[subpos[i]] = arguments[i];
            }

            if (specialized.some(function (s) { return s === _; })) {
                return partial.apply(undefined, [fn].concat(specialized));
            }

            return fn.apply(undefined, specialized);
        };
    }

    return {
        _: _,
        compose: compose,
        sequence: sequence,
        bind: bind,
        aritize: aritize,
        curry: curry,
        rcurry: rcurry,
        ncurry: ncurry,
        rncurry: rncurry,
        partial: partial,
        saturate: saturate
    };
});
