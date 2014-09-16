require.config({
    paths: {
        boot: "../lib/jasmine/boot",
        "jasmine-html": "../lib/jasmine/jasmine-html",
        jasmine: "../lib/jasmine/jasmine",
        'scalejs': '../build/scalejs'
    },
    shim: {
        jasmine: {
            exports: "window.jasmineRequire"
        },
        "jasmine-html": {
            deps: [
                "jasmine"
            ],
            exports: "window.jasmineRequire"
        },
        boot: {
            deps: [
                "jasmine",
                "jasmine-html"
            ],
            exports: "window.jasmineRequire"
        }
    },
    scalejs: {
        extensions: [
        ]
    }
});

require(['boot'], function () {
    require ([
        './base.array.test',
        './json.test'
    ], function () {
        window.onload();
    });
});
