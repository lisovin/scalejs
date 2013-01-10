/// <reference path="require.js"/>
/// <reference path="jasmine.js"/>

/*global requirejs*/
requirejs({
    paths: {
        'scalejs': '../js/scalejs'
    }
}, [
    'base.array.test'
]);
