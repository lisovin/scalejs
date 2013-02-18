var require = {
    "baseUrl": ".",
    "paths":  {
        "es5-shim":  "Scripts/es5-shim.min",
        "jasmine":  "Scripts/jasmine",
        "jasmine-html":  "Scripts/jasmine-html",
        "jasmine.test.runner":  "Scripts/jasmine.test.runner",
        "scalejs":  "Scripts/scalejs-0.2.0"
    },
    "shim":  {
        "jasmine":  {
            "exports":  "jasmine"
        },
        "jasmine-html":  {
            "deps":  [
                "jasmine"
            ]
        }
    }
};
