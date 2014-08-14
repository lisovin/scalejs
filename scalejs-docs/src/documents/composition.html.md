---
title: "Layout"
isPage: true
styles: ["highlight.css"]
---

# UI Composition

<hr>

[UI Composition Sample](http://scalejs.com/scalejs-examples/UIComposition/UIComposition/) |
[UI Composition GitHub](https://github.com/lisovin/scalejs-examples/tree/master/UIComposition)

<hr>

With scalejs there is a solid way to manage the layout in a decoupled manner. 
Using a combination of the mvvm and statechart
extensions allows you to create regions for modules to render themselves without having
any modules "know" about other modules. It enforces loose-coupling and therefore is the
recommended approach to doing your layout. 

Composing your UI begins in the _main_ module which is the shell of your UI.
This acts as a master page for the app. It contains one or more regions. 
Regions are placeholders for content which will be loaded at runtime.
Regions are populated with the Views from other modules. 
Regions can be loaded dynamically and updated at any time in your app.
They can be accessed in a decoupled way using the statechart.

Think of regions as containers in which content can be dynamically loaded. 
This pattern is similar to Microsoft's prism pattern if you are familular with it.

<br>

## Main Module

You may choose a different module to be the __shell__ of your layout, however the main module
is convienient as it is included already in the project template.
This is the starting point of your layout.

##### Example: The main module boilerplate code (mainModule.js)
```javascript
var // imports
	root = sandbox.mvvm.root,
	template = sandbox.mvvm.template,
	registerStates = sandbox.state.registerStates,
	state = sandbox.state.builder.state,
	onEntry = sandbox.state.builder.onEntry,
	// vars
	viewModel = mainViewModel();

// Register application state for the module.
registerStates('root',
	state('app',
		state('main',
			onEntry(function () {
				// Render viewModel using 'main_template' template 
				// (defined in main.html) and show it in the `root` region.
				root(template('main_template', viewModel));
			}))));
```

We will examine this code and how to create regions in the layout.

<br>

### root

`root` is part of the __mvvm__ namespace. Its purpose is to render content in the body of the HTML.
Any content which is applied to the `root()` function will completely overwrite any HTML in the body of the app.
This is useful if you are loading a completely new view into the root, but _most_ of the time your root will remain unchanged.
This is because rather than changing the layout of your application, you most likely will need to change specific regions
which are already defined by the view within the root.

The root expects one of the following function to be passed to it: `dataBinding`, `dataClass`, or `template`.
In our experience, `template` is most commonly used because it is straight-forward and easy to understamd.

Root itself is a region, and behaves similarly to the regions that you will define, except the root region
contains _all_ of the content on your page.

<br>

### template

`template` is a function which takes 2 parameters: a named template from the view and a viewModel to be passed to it.

##### Example: Rendering content using template function in the root region
```javascript
var // imports
var // imports
	!!*root = sandbox.mvvm.root,
	template = sandbox.mvvm.template,**!
	registerStates = sandbox.state.registerStates,
	state = sandbox.state.builder.state,
	onEntry = sandbox.state.builder.onEntry,
	// vars
	viewModel = mainViewModel();

// Register application state for the module.
registerStates('root',
	state('app',
		state('main',
			onEntry(function () {
				// Render viewModel using 'main_template' template 
				// (defined in main.html) and show it in the `root` region.
				!!*root(template('main_template', viewModel));**!
			}))));
```

It is important to note that the template is rendered in the root after the main state heas been entered. 
This is because the states are entered after the application has started.
You do not want to render the DOM until all modules and states have been registered because these happen before your
application runs and it is better to wait for this to happen before attempting to render the layout. 

<br>

### Creating regions within a template

To create and render a region is a joint effort between the view, viewmodel, and the statechart.
In order to create a region you must:

* Define the region in the view using the `render` binding
* Bind the region to an observable declared within the viewModel

The `render` binding is used to populate regions with content using an observable.
Much like the `root` function it expects a `dataBinding`, `dataClass`, or a `template`.

##### Example: definding regions using  render  ([main.html](https://github.com/lisovin/scalejs-examples/blob/master/UIComposition/UIComposition/app/main/views/main.html))
```xml
<div id="main_template">
    <div data-bind="render: foo"></div>
    <!-- ko render: bar--><!-- /ko -->
</div>
```

The above example names two regions: __foo__ and __bar__.
The difference between these two methods of naming regions is that the content of
__foo__ will be rendered within the div, wheras the content of
__bar__ will be rendered within the comments. The former creates a container for the rendered template,
while the latter does not. Depending on what you need in your Layout, you can use either of these methods
to define the render binding.

The next step is defining __foo__ and __bar__ as observables within your viewModel. 

##### Example: declaring regions as observables within the viewmodel ([mainViewModel.js](https://github.com/lisovin/scalejs-examples/blob/master/UIComposition/UIComposition/app/main/viewmodels/mainViewModel.js))
```javascript
/*global define */
define([
    'sandbox!main'
], function (
    sandbox
) {
    'use strict';

    return function () {
        var // imports
            observable = sandbox.mvvm.observable,
            // properties
            foo = observable(),
            bar = observable();

        return {
            foo: foo,
            bar: bar
        };
    };
});
```

<br>

### Rendering views within the regions

In the previous section we created the regions for your layout, but in order for other modules to access the regions they must
be exposed to other modules by adding them on the statechart.

##### Example: Adding regions to the statechart ([mainModule.js](https://github.com/lisovin/scalejs-examples/blob/master/UIComposition/UIComposition/app/main/mainModule.js))
```javascript
/*global define */
define([
    'sandbox!main',
    'app/main/viewmodels/mainViewModel',
    'views!main',
    'bindings!main',
    'styles!main'
], function (
    sandbox,
    mainViewModel
) {
    'use strict';

    return function main() {
        var // imports
            root = sandbox.mvvm.root,
            template = sandbox.mvvm.template,
            registerStates = sandbox.state.registerStates,
            state = sandbox.state.builder.state,
            onEntry = sandbox.state.builder.onEntry,
            // vars
            viewModel = mainViewModel();

        // Register application state for the module.
        registerStates('root',
            state('app',
                state('main',
                    onEntry(function () {
                        !!*this.foo = viewModel.foo;
                        this.bar = viewModel.bar;**!
                        root(template('main_template', viewModel));
                    }))));
    };
});
```

For another module to access these regions, it simply needs to call them from the statechart.
However one thing to keep in mind is that if it tries to access the regions _before_ they 
have been added to the statechart, there will be an error. You can control this by
making the state a descedant of the state which adds the regions to the statechart.
Alternatively, you can create an interim state that waits for an event to notify
the statechart that the properties were added. You then can create a transition
that will allow your module to enter the state in which it tries to use the regions.

In the following example we have created a module called __foobar__. (right click on the app folder and select Add New Item, search for scalejs mvvm module template)

First step we need to do is adding the module's name to app.js

##### Example: Adding foo module to ([app.js](https://github.com/lisovin/scalejs-examples/blob/master/UIComposition/UIComposition/app/app.js))
```javascript
/*global require*/
require([
    'scalejs!application/main!!*,foobar**!'
], function (
    application
) {
    'use strict';

    application.run();
});
```

It contains 2 templates that are to be rendered inside of the regions.

##### Example: Two templates from the foobar module's view, ([foobar.html](https://github.com/lisovin/scalejs-examples/blob/master/UIComposition/UIComposition/app/foobar/views/foobar.html))
```xml
<div id="foo_template">
    <span data-bind="text: fooText"></span>
</div>
<div id="bar_template">
    <span data-bind="text: barText"></span>
</div>
```

In order to render these templates in the regions, we need to access them similarly to how we are rendering
the main template in the root, except we are accessing the regions from the statechart. **First make sure that the foobar state is a child of the main state or else the regions will not be defined**.

##### Example: Rendering templates in statechart regions from ([foobarModule.js](https://github.com/lisovin/scalejs-examples/blob/master/UIComposition/UIComposition/app/foobar/foobarModule.js))
```javascript
/*global define */
define([
    'sandbox!foobar',
    'app/foobar/viewmodels/foobarViewModel',
    'bindings!foobar',
    'views!foobar',
    'styles!foobar'
], function (
    sandbox,
    foobarViewModel
) {
    'use strict';

    return function foobarModule() {
        var // imports
            root = sandbox.mvvm.root,
            template = sandbox.mvvm.template,
            registerStates = sandbox.state.registerStates,
            state = sandbox.state.builder.state,
            onEntry = sandbox.state.builder.onEntry,
            // vars
            foobar = foobarViewModel(sandbox);

        // Register application state for the module.
        !!*registerStates('main',**!
            state('foobar',
                onEntry(function () {
                    !!*this.foo(template('foo_template', foobar));
                    this.bar(template('bar_template', foobar));**!
                })));
    };
});
```

Remember that since fooText and barText are bound in the view, they must be exposed within the viewmodel.

##### Example: Declaring fooText and barText in ([foobarViewModel.js](https://github.com/lisovin/scalejs-examples/blob/master/UIComposition/UIComposition/app/foobar/viewmodels/foobarViewModel.js))
```javascript
/*global define */
define([
    'sandbox!foobar',
], function (
    sandbox
) {
    'use strict';

    return function () {
        var observable = sandbox.mvvm.observable,
            fooText = observable('Foo text'),
            barText = observable('Bar text');

        return {
            fooText: fooText,
            barText: barText
        };
    };
});
```

This is the result of the composition:

![composed](./compose.png)

<br>

## Summary

* Modules can render their content in regions
* Regions are observables that can be specified in the main module and added to the statechart
* Other modules can access the regions using the statechart once they have been added
* Use the `template` function as the most straight-forward was of rending content in a region







