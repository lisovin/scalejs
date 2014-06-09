---
title: "ScaleJS MVVM"
isPage: true
styles: ["highlight.css"]
---

# Model-View-ViewModel (MVVM)

<hr>

MVVM stands for __M__odel-__V__iew-__V__iew__M__odel and enforces [seperation of concerns](http://en.wikipedia.org/wiki/Separation_of_concerns)
so that the User Interface, or "View" is seperated from the data, or "Model". This requires the
use of an aditional layer which provides the interface between View and Model while also
keeping the View and Model agnostic to eachother: the "ViewModel".
There are many patterns which solve this problem that fall into the umbrella of __MV*__ frameworks,
including the MVC pattern. The __ViewModel__ is an efficient and effective way of representing
the data and functions of your view, while keeping the Model abstracted away. 

How does MVVM have to do with scalejs? The core of scalejs, although small, only provides the [architecture](./architecture.html)
of the application. This leaves the implementation details of modules up to the developer. 
The developers of scalejs felt that their applications would need a pattern like MVVM for
the creation of the UI layer, so they created a __scalejs.mvvm__ to extend scalejs.
This adds additional complexity to a module's structure by giving each module its own 
ViewModels, Views, and Bindings. __scalejs.mvvm__ leverages [knockoutjs](http://knockoutjs.com/)
to provide the data-binding between the View and the ViewModel using observable properties.
The Bindings are an extra (optional) layer between the View and the ViewModel which allows
you to create complex bindings.

This extension proved to be essential for creating applications so it is included in the [project template](template.html).
If you know knockoutjs already then learning how to use this extension will not be difficult.
If you have an understanding of MV* patterns but know nothing about knockout, it could be useful for
you to read about knockoutjs in order to get a better understanding of what bindings and observables are.
If you're still a bit confused on what MVVM even is, check it out on [wikipedia](http://en.wikipedia.org/wiki/Model_View_ViewModel)

![Model-View-ViewModel](http://www.codeproject.com/KB/applications/424656/MVVM.png)

## View

_The view consists of elements displayed by the UI such as buttons, labels, regions, and other controls._ 
In scalejs we specify the View using __HTML__. The View consists of __templates__ which
are reusable, small blocks of HTML code that have no parent container and a
unique identifier that has the post-fix `_template`. Data-binding can be applied to the
elements within a view using inline `data-bind` or the abstrated `data-class`.

Here is an example of a View:

```xml
<div id="todo_input_template">
    <input data-class="todo-input" placeholder="What needs to be done?" autofocus>
</div>

<div id="todo_items_template">
    <ul id="todo-list" data-bind="foreach: viewableItems">
        <li data-class="todo-item"></li>
    </ul>
</div>
```

As we can see by the example,

* The view is specified by HTML
* There are two distinct templates in this view, `todo_input_template` and `todo_items_template`
* A template consists of HTML elements which can have a `data-bind` attribute or a `data-class` attribute.

### data-bind

A binding consists of two items, the binding name and value, separated by a colon. 
In the above example, the data-bind used was [foreach](http://knockoutjs.com/documentation/foreach-binding.html)
to show all of the `viewableItems` from the [ViewModel](./mvvm.html#viewmodel).

__scalejs.mvvm__ gives you the ability to use all of the bindings provided by knockoutjs. There
are also some new bindings provided by __scalejs.mvvm__ which can be found in the [scalejs.mvvm API docs](./api.html#mvvm).

_Read more about [knockoutjs binding syntax](http://knockoutjs.com/documentation/binding-syntax.html)_

### data-class

A `data-class` is to `data-bind` as `class` is to the `style` attribute. 
In other words, you have two choices on how to apply your bindings to your elements.
For example you can bind the ViewModel property `title` to the `text` of an element
by specifying in the HTML `data-bind="text: title"`. Similarly, you could make the 
text red by specifying `style="color: red"`. But if your element where to have many
different bindings or complex bindngs, it would be ugly to code all of them inline.
The same way you can abstract all the styles of an element into a `class` in a CSS file
and reference the class name is how you do it with bindings, too. [Bindings](./mvvm.html#bindings)
are an abstraction of the inline `data-bind` attribute to an external JavaScript file.

## ViewModel

The __ViewModel__ is a "model of the view" meaning it is an abstraction of the view that also 
serves in mediating between the view and the model. The __Model__ is your Data-Access-Layer
and the ViewModel is a conceptual representation of the data from the model so that it can
be represented by the View.

In a scalejs ViewModel you can create observable properties
and functions that can be used to bind to the View.

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
            todoItems = observable(),
            todoInput = observable();

        return {
            todoItems: todoItems,
            todoInput: todoInput
        };
    };
});
```

In this example, you can see we declared two observable properties and returned them at the end of the function.
What is returned at the end _is the ViewModel_. Everything which is not included by the return statement is
encapsulated by the ViewModel function and therefore cannot be used to bind to the View. 

## Bindings

If the use of `data-bind` does not suit your needs, you can use a `data-class` to define the bindings for an element.
This is done in an external JavaScript bindings file, which typically will look something like this:

```javascript
/*global define */
/*jslint sloppy: true*/
define({
    'main-text': function (ctx) {
        return {
            text: this.text
        };
    }
});
```

The bindings gets the ViewModel from `this`. The binding context can also be used if you define
an argument for the `main-text` function. This context gives you access to the same context
that knockout provides with things like `$parent`. 

This classes were implemented using the [knockout binding class provider](https://github.com/rniemeyer/knockout-classBindingProvider)
so it might be useful for you to take a look at some of those examples. As per scalejs convention,
the key for the binding is in single quotes and is lower-case and delimitted by "-".


## MVVM Functions

In this section we will give an overview of the various MVVM functions which are exposed and can be used in your app
and extensions.

### observable

This function gives you the power of 2 way data binding. It is exactly the same as [knockout observables](http://knockoutjs.com/documentation/observables.html).

###### Example: using observable
```javascript
var observable = sandbox.mvvm.observable, // importing the observable
	example = observable(), // creating a new empty observable
	example2 = observable('initial value'); // creating an observable with an initial value

console.log(example()); //unwraps observable and prints undefined
console.log(example2()); //unwraps observable and prints 'initial value'

example('new value'); //updates example's value to 'new value'

console.log(example()); //unwraps observable and prints 'new value';

// subscribe to example so that whenever it recieves a new value, this function is called
var subscription = example.subscribe(function(newValue) {
	console.log(newValue);
}); 

subscription.dispose(); //dispose the subscription when it is not needed anymore
```
In the above example, you can see how to create, use, update, and subscribe to observables.

Observables work best when combined with bindings (inline or class). You can bind an observable directly using `data-bind='text: example'`,
which will update an html element's text with the value of example whenever it is changed. If you want to do additional logic 
in a binding when using an observable, you must call it like this `data-bind="text: example() + ' and stuff'"`. 

### observableArray

Observable arrays are a lot like observables, but they also allow you to leverage array functions on the underlying array without
needing to call and update the observable. More information can be found about them on [knockout's website](http://knockoutjs.com/documentation/observableArrays.html)

###### Example: using observableArray
```javascript
var observableArray = sandbox.mvvm.observableArray, //importing observableArray
	exampleArray = observableArray([1,2,3,4,5]); //creating an observableArray

//unwrapping observable arrays
console.log(exampleArray()); //unwraps exampleArray and prints '[1]'
console.log(exampleArray().length); //unwraps exampleArray and prints '1'
console.log(exampleArray()[0]); //unwraps exampleArray and prints the first element in the array

//modifying observable arrays without unwrapping them
exampleArray.push(1); //adds an item to the end of an array
exampleArray.pop(); //removes the last item from the array and returns it
exampleArray.unshift('New Value'); //inserts a new item at the beginning of the array
exampleArray.shift(); //removes the first value of the array and returns it
exampleArray.reverse(); //reverses order of the array
exampleArray.sort(); //sorts the array contents alphabetically (can pass your own comparer func)
exampleArray.splice(1,1,2); //removes values and/or inserts items at an index in the array

//other observable array functions
exampleArray.remove(1); //removes all values which equal 1 and returns them as an array
//removes all values which are less than 3
exampleArray.remove(function(val) {
 return val < 3
});
exampleArray.removeAll([4,5]); //removes all items which equal 4 or 5 and returns them as an array
exampleArray.removeAll(); //removes all the items and returns them as an array

//updating observable array
exampleArray([1,2,3,4,5]);

//other array functions
console.log(exampleArray.indexOf(1)); //prints 0
console.log(exampleArray.slice(0,2); //prints [1,2,3]
```

### computed

Computed is an observable which is generated from other observables. It is very powerful and used often.
It keeps track of all observables which are unwrapped within its function, and whenever any of those observables are updated,
the computed is re-evaluated. [Read more about computed](http://knockoutjs.com/documentation/computedObservables.html)

###### Example: using computed
```javascript
var computed = sandbox.mvvm.computed,
	observable = sandbox.mvvm.observable,
	firstName = observable("Erica"),
	lastName = observable("Gucciardo"),
	fullName = computed(function)() {
		return firstName() + " " + lastName();
	});

console.log(fullName()) //prints 'Erica Gucciardo'

//writable computed observables

fullName = computed({
	read: function() {
		return firstName() + " " + lastName();
	},
	write: function(value) {
		var names = value.split(" ");
		firstName(value[0]);
		lastName(value[1]);
	}
});

// controlling a dependency using peek - only gets evaluated when first name changes
fullName = computed(function() {
	return firstName() + ' ' + lastName.peek();
});
```

### registerBindings and registerTemplates

Although you can use the `bindings!` plugin to registerBindings in the app, you must call `registerTemplates`
on a view in order for it to be registered. You can pass multiple templates or bindings to these functions.

###### Example: using registerBindings and registerTemplates
```javascript
define([
	'text!./example.html',
	'./bindings/exampleBindings'
], function( 
	exampleTemplate,
	exampleBindings
) {
	var registerTemplates = sandbox.mvvm.registerTemplates,
		registerBindings = sandbox.mvvm.registerBindings;

	registerTemplates(exampleTemplate);
	registerBinfings(exampleBindings);
});
```

### toJson, toViewModel, and toObject

These are all helper functions. `toJson` will take any ViewModel (an object containing observables) and map it JSON string.
`toViewModel` will take a plan object and convert it to a viewmodel by wrapping all of its properties in an observable.
`toObject` will take a viewmodel and unwrap all of its observables and return a plain object.

###### Example: using toJson, toViewModel, and toObject
```javascript
var toJson = sandbox.mvvm.toJson,
	toViewModel = sandbox.mvvm.toViewModel,
	toObject = sandbox.mvvm.toObject,
	object = {
		firstName: 'Erica',
		lastName: 'Gucciardo'
	},
	viewModel = toViewModel(object),
	obj;

console.log(viewModel.firstName()); //prints 'Erica' as firstName is now wrapped in an observable

obj = toObject(viewModel); //converts viewModel back to a plain object

console.log(toJson(viewModel)); //prints '{ firstName: "Erica", lastName: "Gucciardo"}'
```

### dataClass, template, and dataBinding

Each of these are used to populate renderables (or regions). More information on that can be found in [UI composition](./composition.html)

### root

root is an observable which is bound to a renderable on the body. It will populate any template/binding/class passed to it within the body of the html.







