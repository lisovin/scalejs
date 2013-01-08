/*global define */
define([
    'scalejs!module',
    './viewmodels/mainViewModel',
    'text!./views/main.html',
    './bindings/mainBindings.js'
], function (
    module,
    mainViewModel,
    mainTemplate,
    mainBindings
) {
    'use strict';

    function create(sandbox) {
        var createView = sandbox.mvvm.createView;

        function start() {
            var viewModel = mainViewModel(sandbox);

            createView({
                dataContext: viewModel,
                templates: [mainTemplate],
                bindings: [mainBindings]
            });

            viewModel.text('Hello World!');
        }

        return {
            start: start
        };
    }

    return module('main', create);
});
