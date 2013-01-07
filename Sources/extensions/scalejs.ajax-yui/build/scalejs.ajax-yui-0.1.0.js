
define('yui!io',['yui!base,io'], function (Y) { return Y;});

/*global define*/
define('scalejs.ajax-yui/ajax',[
    'yui!io',
    'scalejs!core'
], function (
    Y,
    core
) {
    

    function post(url, data) {
        var observable = core.reactive.Observable,
            viewmodelToJson = core.mvvm.toJson,
            fromJson = core.json.fromJson,
            error = core.log.error;

        return observable.create(function (observer) {
            var jsonString,
                cfg;
            /*jslint unparam: true*/
            function success(id, response) {
                var resp = fromJson(response.responseText);
                observer.onNext(resp);
                observer.onCompleted();
            }
            /*jslint unparam: false*/

            /*jslint unparam: true*/
            function failure(id, response) {
                error('Error: "' + response.status + ': ' +
                                response.statusText + '" in response to POST "' +
                                jsonString + '" to "' + url + '"');
                observer.onError({
                    status: response.status,
                    statusText: response.statusText,
                    responseText: response.responseText
                });
                observer.onCompleted();
            }
            /*jslint unparam: false*/

            jsonString = viewmodelToJson(data);
            cfg = {
                method: 'POST',
                data: jsonString,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                on: {
                    success: success,
                    failure: failure
                }
            };
            Y.io(url, cfg);
            return function () {
            };
        });
    }

    function get(url, format) {
        var observable = core.reactive.Observable,
            fromJson = core.json.fromJson,
            error = core.log.error;

        return observable.create(function (observer) {
            /*jslint unparam: true*/
            function success(id, response) {
                var text = response.responseText,
                    data = format === 'text' ? text : fromJson(text);
                observer.onNext(data);
                observer.onCompleted();
            }
            /*jslint unparam: false*/

            /*jslint unparam: true*/
            function failure(id, response) {
                error('Error: "' + response.status + ': ' +
                    response.statusText + ' in response to GET to ' + url + '"');
                observer.onError({
                    status: response.status,
                    statusText: response.statusText,
                    responseText: response.responseText
                });
                observer.onCompleted();
            }
            /*jslint unparam: false*/

            var cfg = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                on: {
                    success: success,
                    failure: failure
                }
            };
            Y.io(url, cfg);

            return function () {
            };
        });
    }

    return {
        post: post,
        get: get
    };
});

define('yui!json',['yui!base,json'], function (Y) { return Y;});

/*global define,console,document*/
define('scalejs.ajax-yui/json',[
    'yui!json'
], function (
    Y
) {
    

    function toJson(obj) {
        return Y.JSON.stringify(obj);
    }

    function fromJson(json) {
        if (json === "") {
            return {};
        }
        return Y.JSON.parse(json);
    }

    return {
        toJson: toJson,
        fromJson: fromJson
    };
});

/*global define*/
define('scalejs.ajax-yui',[
    'scalejs.ajax-yui/ajax',
    'scalejs.ajax-yui/json'
], function (
    ajax,
    json
) {
    

    return {
        ajax: ajax,
        json: json
    };
});

