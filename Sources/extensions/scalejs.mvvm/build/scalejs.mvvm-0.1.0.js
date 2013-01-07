
/*global define,document*/
define('scalejs.mvvm/mvvm',[
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

/*global define,document*/
define('scalejs.controls/content',[
    'scalejs!core',
    'knockout'
], function (
    core,
    ko
) {

    

    var unwrap = ko.utils.unwrapObservable,
        has = core.object.has;

    /*jslint unparam: true*/
    function init(element, valueAccessor, allBindingsAccessor, viewModel) {
        var bindings = valueAccessor(),
            templateId = bindings.template,
            parent = element.parentNode,
            dataClass = element.getAttribute('data-class'),
            start = document.createComment('begin content: data-class="' + dataClass + '"'),
            end = document.createComment('end content: data-class="' + dataClass + '"'),
            templateInstance,
            children = [],
            child;

        parent.replaceChild(end, element);
        parent.insertBefore(start, end);

        templateInstance = document.getElementById(templateId).cloneNode(true);
        while (templateInstance.hasChildNodes()) {
            child = templateInstance.removeChild(templateInstance.firstChild);
            children.push(child);
            //parent.insertBefore(child, end);
        }

        ko.computed({
            read: function () {
                var content = unwrap(bindings.content),
                    i;
                bindings = unwrap(valueAccessor());
                if (has(content)) {
                    for (i = 0; i < children.length; i += 1) {
                        child = children[i];
                        parent.insertBefore(child, end);
                        if (child.nodeType === 1) {
                            ko.applyBindings(content, child);
                        }
                    }
                }
            },
            disposeWhenNodeIsRemoved: parent
        });

        return { 'controlsDescendantBindings': true };
    }
    /*jslint unparam: false*/

    ko.bindingHandlers.content = {
        init: init
    };
});
/*global define */
define('scalejs.controls/module',[
    'require',
    'knockout'
], function (
    require,
    ko
) {
    

    /*jslint unparam: true*/
    function init(element, valueAccessor, allBindingsAccessor, vm) {
        var value = valueAccessor(),
            moduleId = value.id;

        require(['scalejs/application', moduleId], function (application, module) {
            application.registerModule(module, value, element);
        });

        return { controlsDescendantBindings: true };
    }
    /*jslint unparam: false*/

    ko.bindingHandlers.module = {
        init: init
    };
});

/*global define*/
define('scalejs.controls/listview',[
    'knockout'
], function (
    ko
) {
    

    var unwrap = ko.utils.unwrapObservable;

    function wrapValueAccessor(valueAccessor) {
        return function () {
            var value = valueAccessor();
            return {
                name: value.itemTemplate,
                foreach: unwrap(value.itemsSource)
            };
        };
    }

    function init(
        element,
        valueAccessor,
        allBindingsAccessor,
        viewModel,
        bindingContext
    ) {
        return ko.bindingHandlers.template.init(
            element,
            wrapValueAccessor(valueAccessor),
            allBindingsAccessor,
            viewModel,
            bindingContext
        );
    }

    function update(
        element,
        valueAccessor,
        allBindingsAccessor,
        viewModel,
        bindingContext
    ) {
        return ko.bindingHandlers.template.update(
            element,
            wrapValueAccessor(valueAccessor),
            allBindingsAccessor,
            viewModel,
            bindingContext
        );
    }

    ko.bindingHandlers.listview = {
        init: init,
        update: update
    };
});

/*global define*/
define('scalejs.bindings/change',[
    'knockout',
    'scalejs!core'
], function (
    ko,
    core
) {
    

    var is = core.type.is,
        has = core.object.has;

    /*jslint unparam: true*/
    function init(element, valueAccessor, allBindingsAccessor, viewModel) {
        if (!has(viewModel)) {
            return;
        }

        var unwrap = ko.utils.unwrapObservable,
            value = valueAccessor(),
            properties = unwrap(value),
            //toEnumerable = core.linq.enumerable.from,
            property,
            handler,
            currentValue,
            changeHandler;

        function bindPropertyChangeHandler(h) {
            return function (newValue) {
                if (newValue !== currentValue) {
                    currentValue = newValue;
                    h.call(viewModel, newValue, element);
                }
            };
        }

        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                handler = properties[property];
                if (is(handler.initial, 'function')) {
                    handler.initial.apply(viewModel, [unwrap(viewModel[property]), element]);
                }
                if (is(handler.update, 'function')) {
                    changeHandler = bindPropertyChangeHandler(handler.update);
                }
                if (is(handler, 'function')) {
                    changeHandler = bindPropertyChangeHandler(handler);
                }
                if (changeHandler) {
                    viewModel[property].subscribe(changeHandler);
                }
            }
        }
    }
    /*jslint unparam: false*/

    ko.bindingHandlers.change = {
        init: init
    };
});

/*global define*/
define('scalejs.mvvm',[
    'scalejs.mvvm/mvvm',
    'scalejs.controls/content',
    'scalejs.controls/module',
    'scalejs.controls/listview',
    'scalejs.bindings/change'
], function (
    mvvm
) {
    

    function buildSandbox(sandbox) {
        mvvm.buildSandbox(sandbox);
    }

    return {
        core: {
            mvvm: mvvm
        },
        buildSandbox: buildSandbox
    };
});

