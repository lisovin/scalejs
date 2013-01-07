// ReSharper disable InconsistentNaming, DuplicatingLocalDeclaration, UnusedParameter
/*global define */
/*jslint unparam: true*/
define([ 'linq' ], function (Enumerable) {
    'use strict';

    function enumerable(linqEnumerable) {
        var e = {};

        e.unwrap = function () { return linqEnumerable; };

        e.cascadeBreadthFirst = function (func, resultSelector) {
            return enumerable(Enumerable.prototype.CascadeBreadthFirst.apply(linqEnumerable, arguments));
        };

        e.cascadeDepthFirst = function (func, resultSelector) {
            return enumerable(Enumerable.prototype.CascadeDepthFirst.apply(linqEnumerable, arguments));
        };

        e.flatten = function () {
            return enumerable(Enumerable.prototype.Flatten.apply(linqEnumerable, arguments));
        };

        e.pairwise = function (selector) {
            return enumerable(Enumerable.prototype.Pairwise.apply(linqEnumerable, arguments));
        };

        e.scan = function (seed, func, resultSelector) {
            return enumerable(Enumerable.prototype.Scan.apply(linqEnumerable, arguments));
        };

        e.select = function (selector) {
            return enumerable(Enumerable.prototype.Select.apply(linqEnumerable, arguments));
        };

        e.selectMany = function (collectionSelector, resultSelector) {
            return enumerable(Enumerable.prototype.SelectMany.apply(linqEnumerable, arguments));
        };

        e.where = function (predicate) {
            return enumerable(Enumerable.prototype.Where.apply(linqEnumerable, arguments));
        };

        e.ofType = function (type) {
            return enumerable(Enumerable.prototype.OfType.apply(linqEnumerable, arguments));
        };

        e.zip = function (source, selector) {
            var le = source.unwrap();
            return enumerable(linqEnumerable.Zip(le, selector));
        };

        e.join = function (inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector) {
            return enumerable(Enumerable.prototype.Join.apply(linqEnumerable, arguments));
        };

        e.groupJoin = function (inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector) {
            return enumerable(Enumerable.prototype.GroupJoin.apply(linqEnumerable, arguments));
        };

        e.all = function (predicate) {
            return Enumerable.prototype.All.apply(linqEnumerable, arguments);
        };

        e.any = function (predicate) {
            return Enumerable.prototype.Any.apply(linqEnumerable, arguments);
        };

        e.concat = function (second) {
            return enumerable(Enumerable.prototype.Concat.apply(linqEnumerable, arguments));
        };

        e.insert = function (index, second) {
            return enumerable(Enumerable.prototype.Insert.apply(linqEnumerable, arguments));
        };

        e.alternate = function (value) {
            return enumerable(Enumerable.prototype.Alternate.apply(linqEnumerable, arguments));
        };

        e.contains = function (value, compareSelector) {
            return Enumerable.prototype.Contains.apply(linqEnumerable, arguments);
        };

        e.defaultIfEmpty = function (defaultValue) {
            return enumerable(Enumerable.prototype.DefaultIfEmpty.apply(linqEnumerable, arguments));
        };

        e.distinct = function (compareSelector) {
            return enumerable(Enumerable.prototype.Distinct.apply(linqEnumerable, arguments));
        };

        e.except = function (second, compareSelector) {
            return enumerable(Enumerable.prototype.Except.apply(linqEnumerable, arguments));
        };

        e.intersect = function (second, compareSelector) {
            return enumerable(Enumerable.prototype.Intersect.apply(linqEnumerable, arguments));
        };

        e.sequenceEqual = function (second, compareSelector) {
            return Enumerable.prototype.SequenceEqual.apply(linqEnumerable, arguments);
        };

        e.union = function (second, compareSelector) {
            return enumerable(Enumerable.prototype.Union.apply(linqEnumerable, arguments));
        };

        e.orderBy = function (keySelector) {
            return enumerable(Enumerable.prototype.OrderBy.apply(linqEnumerable, arguments));
        };

        e.orderByDescending = function (keySelector) {
            return enumerable(Enumerable.prototype.OrderByDescending.apply(linqEnumerable, arguments));
        };

        e.reverse = function () {
            return enumerable(Enumerable.prototype.Reverse.apply(linqEnumerable, arguments));
        };

        e.shuffle = function () {
            return enumerable(Enumerable.prototype.Shuffle.apply(linqEnumerable, arguments));
        };

        e.groupBy = function (keySelector, elementSelector, resultSelector, compareSelector) {
            return enumerable(Enumerable.prototype.GroupBy.apply(linqEnumerable, arguments));
        };

        e.partitionBy = function (keySelector, elementSelector, resultSelector, compareSelector) {
            return enumerable(Enumerable.prototype.PartitionBy.apply(linqEnumerable, arguments));
        };

        e.bufferWithCount = function (count) {
            return enumerable(Enumerable.prototype.BufferWithCount.apply(linqEnumerable, arguments));
        };

        e.aggregate = function (seed, func, resultSelector) {
            return Enumerable.prototype.Aggregate.apply(linqEnumerable, arguments);
        };

        e.average = function (selector) {
            return Enumerable.prototype.Average.apply(linqEnumerable, arguments);
        };

        e.count = function (predicate) {
            return Enumerable.prototype.Count.apply(linqEnumerable, arguments);
        };

        e.max = function (selector) {
            return Enumerable.prototype.Max.apply(linqEnumerable, arguments);
        };

        e.min = function (selector) {
            return Enumerable.prototype.Min.apply(linqEnumerable, arguments);
        };

        e.maxBy = function (keySelector) {
            return Enumerable.prototype.MaxBy.apply(linqEnumerable, arguments);
        };

        e.minBy = function (keySelector) {
            return Enumerable.prototype.MinBy.apply(linqEnumerable, arguments);
        };

        e.sum = function (selector) {
            return Enumerable.prototype.Sum.apply(linqEnumerable, arguments);
        };

        e.elementAt = function (index) {
            return Enumerable.prototype.ElementAt.apply(linqEnumerable, arguments);
        };

        e.elementAtOrDefault = function (index, defaultValue) {
            return Enumerable.prototype.ElementAtOrDefault.apply(linqEnumerable, arguments);
        };

        e.first = function (predicate) {
            return Enumerable.prototype.First.apply(linqEnumerable, arguments);
        };

        e.firstOrDefault = function (defaultValue, predicate) {
            return Enumerable.prototype.FirstOrDefault.apply(linqEnumerable, arguments);
        };

        e.last = function (predicate) {
            return Enumerable.prototype.Last.apply(linqEnumerable, arguments);
        };

        e.lastOrDefault = function (defaultValue, predicate) {
            return Enumerable.prototype.LastOrDefault.apply(linqEnumerable, arguments);
        };

        e.single = function (predicate) {
            return Enumerable.prototype.Single.apply(linqEnumerable, arguments);
        };

        e.singleOrDefault = function (defaultValue, predicate) {
            return Enumerable.prototype.SingleOrDefault.apply(linqEnumerable, arguments);
        };

        e.skip = function (count) {
            return enumerable(Enumerable.prototype.Skip.apply(linqEnumerable, arguments));
        };

        e.skipWhile = function (predicate) {
            return enumerable(Enumerable.prototype.SkipWhile.apply(linqEnumerable, arguments));
        };

        e.take = function (count) {
            return enumerable(Enumerable.prototype.Take.apply(linqEnumerable, arguments));
        };

        e.takeWhile = function (predicate) {
            return enumerable(Enumerable.prototype.TakeWhile.apply(linqEnumerable, arguments));
        };

        e.takeExceptLast = function (count) {
            return enumerable(Enumerable.prototype.TakeExceptLast.apply(linqEnumerable, arguments));
        };

        e.takeFromLast = function (count) {
            return enumerable(Enumerable.prototype.TakeFromLast.apply(linqEnumerable, arguments));
        };

        e.indexOf = function (item) {
            return Enumerable.prototype.IndexOf.apply(linqEnumerable, arguments);
        };

        e.lastIndexOf = function (item) {
            return Enumerable.prototype.LastIndexOf.apply(linqEnumerable, arguments);
        };

        e.toArray = function () {
            return Enumerable.prototype.ToArray.apply(linqEnumerable, arguments);
        };

        e.toLookup = function (keySelector, elementSelector, compareSelector) {
            return Enumerable.prototype.ToLookup.apply(linqEnumerable, arguments);
        };

        e.toObject = function (keySelector, elementSelector) {
            return Enumerable.prototype.ToObject.apply(linqEnumerable, arguments);
        };

        e.toDictionary = function (keySelector, elementSelector, compareSelector) {
            return Enumerable.prototype.ToDictionary.apply(linqEnumerable, arguments);
        };

        e.toJSON = function (replacer, space) {
            return Enumerable.prototype.ToJSON.apply(linqEnumerable, arguments);
        };

        e.toString = function (separator, selector) {
            return Enumerable.prototype.ToString.apply(linqEnumerable, arguments);
        };

        e.doAction = function (action) {
            return enumerable(Enumerable.prototype.doAction.apply(linqEnumerable, arguments));
        };

        e.forEach = function (action) {
            Enumerable.prototype.ForEach.apply(linqEnumerable, arguments);
        };

        e.write = function (separator, selector) {
            Enumerable.prototype.Write.apply(linqEnumerable, arguments);
        };

        e.writeLine = function (selector) {
            Enumerable.prototype.WriteLine.apply(linqEnumerable, arguments);
        };

        e.force = function () {
            Enumerable.prototype.Force.apply(linqEnumerable, arguments);
        };

        e.letBind = function (bindFunc) {
            return enumerable(linqEnumerable.Let(function (le) {
                var result = bindFunc(enumerable(le));
                return result.unwrap();
            }));
        };

        e.share = function () {
            return enumerable(Enumerable.prototype.Share.apply(linqEnumerable, arguments));
        };

        e.memoizeAll = function () {
            return enumerable(Enumerable.prototype.MemoizeAll.apply(linqEnumerable, arguments));
        };

        e.catchException = function (handler) {
            return enumerable(Enumerable.prototype.catchException.apply(linqEnumerable, arguments));
        };

        e.finallyAction = function (finallyAction) {
            return enumerable(Enumerable.prototype.finallyAction.apply(linqEnumerable, arguments));
        };

        e.trace = function (message, selector) {
            return enumerable(Enumerable.prototype.Trace.apply(linqEnumerable, arguments));
        };

        return e;
    }

    var e = {};

    e.choice = function () {
        return enumerable(Enumerable.Choice.apply(null, arguments));
    };

    e.cycle = function () {
        return enumerable(Enumerable.Cycle.apply(null, arguments));
    };

    e.empty = function () {
        return enumerable(Enumerable.Empty.apply(null, arguments));
    };

    e.from = function (obj) {
        return enumerable(Enumerable.From.apply(null, arguments));
    };

    e.returnValue = function (element) {
        return enumerable(Enumerable.returnValue.apply(null, arguments));
    };

    e.matches = function (input, pattern, flags) {
        return enumerable(Enumerable.Matches.apply(null, arguments));
    };

    e.range = function (start, count, step) {
        return enumerable(Enumerable.Range.apply(null, arguments));
    };

    e.rangeDown = function (start, count, step) {
        return enumerable(Enumerable.RangeDown.apply(null, arguments));
    };

    e.rangeTo = function (start, to, step) {
        return enumerable(Enumerable.RangeTo.apply(null, arguments));
    };

    e.repeat = function (obj, num) {
        return enumerable(Enumerable.Repeat.apply(null, arguments));
    };

    e.repeatWithFinalize = function (initializer, finalizer) {
        return enumerable(Enumerable.RepeatWithFinalize.apply(null, arguments));
    };

    e.generate = function (func, count) {
        return enumerable(Enumerable.Generate.apply(null, arguments));
    };

    e.toInfinity = function (start, step) {
        return enumerable(Enumerable.ToInfinity.apply(null, arguments));
    };

    e.toNegativeInfinity = function (start, step) {
        return enumerable(Enumerable.ToNegativeInfinity.apply(null, arguments));
    };

    e.unfold = function (seed, func) {
        return enumerable(Enumerable.Unfold.apply(null, arguments));
    };

    return e;
});