/*global define,document*/
define([
    'knockout',
    'knockout.mapping',
    'knockout-classBindingProvider',
    'scalejs!core'
], function (
    ko,
    mapping,
    ClassBindingProvider,
    core
) {
    'use strict';

    var has = core.object.has,
        classBindingProvider = new ClassBindingProvider();

    ko.bindingProvider.instance = classBindingProvider;

    function observable(initialValue) {
        return ko.observable(initialValue);
    }

    function observableArray(initialValue) {
        return ko.observableArray(initialValue);
    }

    function computed(func) {
        return ko.computed(func);
    }

    function toJson(viewModel) {
        // Extracts underlying value from observables
        return mapping.toJSON(viewModel);
    }

    function registerBindings(newBindings) {
        classBindingProvider.registerBindings(newBindings);
    }

    function toViewModel(data, viewModel, mappings) {
        /*
    var knockoutStyleMappings = {};
    // Convert our simple mappings to what the mapping plugin expects
    // See http://knockoutjs.com/documentation/plugins-mapping.html
    for (var mk in mappings)
    knockoutStyleMappings[mk] = {
    create: function (opt) {
    return mappings[mk](opt.data);
    }
    }; */
        var knockoutStyleMappings = core.linq.enumerable
                .from(mappings)
                .select(function (kv) {
                    return {
                        Key: kv.Key,
                        create: function (options) { return kv.Value(options.data); }
                    };
                })
                .toObject();

        return mapping.fromJS(data, knockoutStyleMappings, viewModel);
    }

    function resolveNamespace(path, namespaces) {
        var slash = path.lastIndexOf('/'),
            namespace,
            control;

        if (slash < 0) {
            return has(namespaces, '') ? namespaces[''] + '/' + path : path;
        }

        namespace = path.substring(0, slash);
        control = path.substring(slash + 1);

        if (has(namespaces, namespace)) {
            namespace = namespaces[namespace];
        }

        return namespace + '/' + control;
    }

    function buildSandbox(sandbox) {
        var $ = core.dom.$;

        function createView(options) {
            /*var textDependencies = ko.utils.arrayMap(options.templates || [], function (template) {
                    return 'text!' + template;
                }),
                dependencies = textDependencies.concat(options.bindings || []);
                //templateHtml = options.html || defaultTemplateHtml,
                //bindings = options.bindings || { },*/
            var dataContext = options.dataContext || { },
                templates = options.templates || [],
                bindings = options.bindings || [],
                i,
                moduleBindings = { },
                moduleId = sandbox.getModuleId(),
                moduleClass = moduleId,
                moduleBaseClass = 'scalejs-module-' + moduleId,
                templateId = moduleId + '_template',
                defaultTemplateHtml = '<div id="' + templateId + '" style="display: none"></div>',
                moduleTemplate = $(templateId),
                templatesDiv = $('scalejs-templates'),
                box,
                bindingsOrFactory,
                bindingsInstance;

            // append template to document body if it doesn't exist yet
            if (!has(moduleTemplate)) {
                // ensure 'templates' div exists
                if (!has(templatesDiv)) {
                    core.dom.appendElementHtml(document.body,
                        '<div id="scalejs-templates" style="display:none"></div>');
                    templatesDiv = $('scalejs-templates');
                }
                // add templates to dom
                for (i = 0; i < templates.length; i += 1) {
                    core.dom.appendElementHtml(templatesDiv, templates[i]);
                }
                // if module template still doesn't exist in DOM then create default one
                moduleTemplate = $(templateId);
                if (!has(moduleTemplate)) {
                    core.dom.appendElementHtml(templatesDiv, defaultTemplateHtml);
                }
            }
            // append module instance div
            box = sandbox.getBox();
            box.setAttribute('class', moduleClass);
            box.setAttribute('data-class', moduleBaseClass + ' ' + moduleClass);
            //sandbox.dom.appendHtml('<div data-class="' + moduleBaseClass + ' ' + moduleClass + '"></div>');
            // register module binding
            moduleBindings[moduleBaseClass] =
                function () {
                    return {
                        template: {
                            name: templateId
                        }
                    };
                };
            registerBindings(moduleBindings);
            // register additional module bindings 
            for (i = 0; i < options.bindings.length; i += 1) {
                bindingsOrFactory = bindings[i];
                if (core.type.is(bindingsOrFactory, 'function')) {
                    bindingsInstance = bindingsOrFactory(sandbox);
                } else {
                    bindingsInstance = bindingsOrFactory;
                }

                registerBindings(bindingsInstance);
            }

            // apply bindings
            ko.applyBindings(dataContext, box);
            /*
            // notify if anyone interested
            if (is(options, 'onCreated', 'function')) {
                options.onCreated();
            }*/
        }

        sandbox.mvvm = {
            createView: createView,
            observable: observable,
            observableArray: observableArray,
            computed: computed,
            registerBindings: registerBindings,
            //addCustomBinding: addCustomBinding,
            //unwrapObservable: unwrapObservable,
            toJson: toJson,
            toViewModel: toViewModel
        };
    }

    return {
        toJson: toJson,
        resolveNamespace: resolveNamespace,
        buildSandbox: buildSandbox
    };
});
