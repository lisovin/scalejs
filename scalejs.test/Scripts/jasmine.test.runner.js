/*global define,require,jasmine*/
define([
    'jasmine',
    'jasmine-html'
], function () {
    'use strict';

    function run() {
        var jasmineEnv = jasmine.getEnv(),
            htmlReporter = new jasmine.HtmlReporter();

        jasmineEnv.updateInterval = 1000;
        jasmineEnv.addReporter(htmlReporter);

        jasmineEnv.specFilter = function (spec) {
            return htmlReporter.specFilter(spec);
        };

        jasmineEnv.execute();
    }

    return {
        load: function (name, req, load) {
            req([name], function (loadedModule) {
                load(loadedModule);
                run();
            });
        }
    };
});
