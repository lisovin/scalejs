/*global define*/
define([
    'rx',
    'rx.binding'
], function (
    rx
) {
    'use strict';

    var subject = new rx.Subject();

    function observe() {
        return subject.asObservable();
    }

    function publish(event) {
        subject.onNext(event);
    }

    return {
        observe: observe,
        publish: publish
    };

});
