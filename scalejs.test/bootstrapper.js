/*global require*/
/// <reference path="Scripts/require.js"/>
/// <reference path="Scripts/jasmine.js"/>
require({
    "paths":  {
        "scalejs":  "../scalejs/scalejs",
        "es5-shim": "Scripts/es5-shim",
        "jasmine":  "Scripts/jasmine",
        "jasmine-html":  "Scripts/jasmine-html"
    },
    "shim":  {
        "jasmine":  {
            "exports":  "jasmine"
        },
        "jasmine-html":  {
            "deps":  [
                "jasmine"
            ],
            "exports":  "jasmine"
        }
    }
}, ['tests/all.tests']);
