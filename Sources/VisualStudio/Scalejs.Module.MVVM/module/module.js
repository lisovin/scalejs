/*global define */
define([
    'scalejs!module',
    './viewmodels/$fileinputname$ViewModel',
    'text!./views/$fileinputname$.html',
    './bindings/$fileinputname$Bindings.js'
], function (
    module,
    $fileinputname$ViewModel,
    $fileinputname$Template,
    $fileinputname$Bindings
) {
    'use strict';

    function create(sandbox) {
        var createView = sandbox.mvvm.createView;

        function start() {
            var viewModel = $fileinputname$ViewModel(sandbox);

            createView({
                dataContext: viewModel,
                templates: [$fileinputname$Template],
                bindings: [$fileinputname$Bindings]
            });

            viewModel.text('Hello World!');
        }

        return {
            start: start
        };
    }

    return module('$fileinputname$', create);
});
