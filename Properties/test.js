/// <reference path="../Scripts/require.js"/>
/// <reference path="../Scripts/jasmine.js"/>

/*global requirejs*/
requirejs({
    paths: {
        'scalejs': '../build/scalejs-0.1.1'
    }
}, ['../test/all.tests']);
