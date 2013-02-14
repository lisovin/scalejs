/*global define,console,document*/
/*jslint nomen: true*/
define([
], function (
) {
    'use strict';

    var _ = {};

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

        var args = Array.slice(arguments, 0);

        return function () {
            return fn.apply(this, args.concat(Array.slice(arguments, 0)));
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

        var args = Array.slice(arguments, 1),
            //substitution positions
            subpos = [],
            i;

        for (i = 0; i < arguments.length; i += 1) {
            if (arguments[i] === _) {
                subpos.push(i);
            }
        }

        return function () {
            var specialized = args.concat(Array.slice(arguments, subpos.length)),
                i;

            for (i = 0; i < Math.min(subpos.length, arguments.length); i += 1) {
                specialized[subpos[i]] = arguments[i];
            }

            for (i = 0; i < specialized.length; i += 1) {
                if (specialized[i] === _) {
                    return fn.partial.apply(fn, specialized);
                }
            }

            return fn.apply(undefined, specialized);
        };
    }

    return {
        _: _,
        curry: curry,
        partial: partial
    };
});
