/*global define*/
define([
    'require',
    'rx',
    'rx.binding',
    'rx.time'
], function (
    require,
    rx
) {
    'use strict';

    rx.Observable.fromRequire = function (dependencies) {
        return rx.Observable.create(function (observer) {
            require(dependencies, function () {
                observer.onNext(arguments);
                observer.onCompleted();
            });
        });
    };

    rx.Observable.fromEnumerable = function (source) {
        return rx.Observable.createWithDisposable(function (observer) {
            var disposable = rx.Disposable.create(function () {
            }),
                enumerator = source.GetEnumerator();

            rx.Scheduler.currentThread.scheduleRecursive(function (self) {
                try {
                    if (!disposable.isDisposed && enumerator.MoveNext()) {
                        observer.onNext(enumerator.Current());
                        self();
                    } else {
                        enumerator.Dispose();
                        observer.onCompleted();
                    }
                } catch (e) {
                    enumerator.Dispose();
                    observer.onError(e);
                }
            });

            return disposable;
        });
    };

    return rx;
});
