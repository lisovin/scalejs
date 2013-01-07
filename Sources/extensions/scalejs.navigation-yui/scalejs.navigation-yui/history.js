/*global define*/
define([
    'yui!history',
    'scalejs/core'
], function (
    Y,
    core
) {
    'use strict';

    var history = new Y.HistoryHash();

    function add(state) {
        history.add(state);
    }

    function addValue(key, value, options) {
        history.addValue(key, value, options);
    }

    function get(key) {
        return history.get(key);
    }

    function replace(state) {
        history.replace(state);
    }

    function replaceValue(key, value, options) {
        history.replaceValue(key, value, options);
    }

    function observe() {
        var observable = core.reactive.Observable,
            disposable = core.reactive.Disposable;

        return observable.createWithDisposable(function (observer) {
            var subscription = history.on('change', function (e) {
                observer.onNext({
                    changed: e.changed,
                    removed: e.removed
                });
            });

            return disposable.create(function () {
                subscription.detach();
            });
        }).publishValue({ initial: history.get() })
            .refCount();
    }

    return {
        add: add,
        addValue: addValue,
        get: get,
        replace: replace,
        replaceValue: replaceValue,
        observe: observe
    };
});
