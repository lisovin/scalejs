/*global require*/
/// <reference path="Scripts/require.js"/>
/// <reference path="Scripts/jasmine.js"/>
require({
    "paths":  {
        "scalejs":  "../scalejs/build/scalejs-0.2.8",
        "es5-shim": "Scripts/es5-shim"
    }
}, ['tests/all.tests']);
