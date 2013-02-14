/*global require*/
/// <reference path="Scripts/require.js"/>
/// <reference path="Scripts/jasmine.js"/>
require({
    "paths":  {
        "scalejs":  "Scripts/scalejs-0.2.0",
        "es5-shim": "Scripts/es5-shim"
    }
}, ['tests/all.tests']);
