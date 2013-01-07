/*global define,window*/
/*jslint todo:true*/
define([
    './history'
], function (
    history
) {
    'use strict';

    function navigation(core) {
        var has = core.object.has,
            merge = core.object.merge,
            toEnumerable = core.linq.enumerable.from,
            navigated = history
                .observe()
                .select(function (event) {
                    var retEvent,
                        changed,
                        removed;

                    if (has(event, 'initial')) {
                        retEvent = event.initial;
                    } else {
                        changed = toEnumerable(event.changed)
                            .toObject("$.Key", "$.Value.newVal");
                        removed = toEnumerable(event.removed)
                            .toObject("$.Key", "undefined");
                        retEvent = merge(history.get(), changed, removed);
                    }
                    return retEvent;
                })
                .publishValue(undefined)
                .refCount();
        // TODO: unsubscribe?

        function observe() {
            return navigated.where(function (evt) {
                return has(evt);
            });
        }

        function navigate(params) {
            var remove = toEnumerable(history.get()).toObject("$.Key", "null"),
                newstate;
            params = has(params) ? params : {};
            newstate = merge(remove, params);
            history.add(newstate);
        }

        function navigateRelative(params) {
            params = has(params) ? params : {};
            history.add(params);
        }

        function back(steps) {
            window.history.go(has(steps) ? -steps : -1);
        }

        return {
            observe: observe,
            navigate: navigate,
            navigateRelative: navigateRelative,
            back: back
        };
    }

    return navigation;
});
