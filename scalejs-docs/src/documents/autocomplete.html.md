---
title: "ScaleJS Docs"
isPage: true
styles: ["highlight.css"]
---

<link href="autocomplete/select2-bootstrap.css" rel="stylesheet" type="text/css" />
<link href="autocomplete/select2.css" rel="stylesheet" type="text/css" />
<script src="autocomplete/autocomplete-test-1.0.1.js" type="text/javascript"></script>

scalejs.autocomplete-select2
============================

An autocomplete extension for scalejs based on Select2. This extension provides a way to use select2 and many of its advanced features while still following scalejs patterns. 

# Features

## Direct Passing to Select2

Any object bound to the paramater ```select2``` will be passed directly to select2, allowing the developer to use all of the advanced features of select2 as if they are using select2 directly, with no additional modifications needed.

## Templating

The id of a template defined in the view can be bound to the paramater ```itemTemplate```, and each item in the results dropdown will be rendered using this template. Also, another template id can be bound to 'selectedItemTemplate' to cause the selected item to be rendered with a different template

## Persistent Queries

An observable bound to the paramtater ```userInput``` will expose the user's query to the viewmodel in real time, and cause this query to persist between searches in each select2 box.

## Observable Output

The user's selection is returned to the viewmodel through the knockout observable bound to the ```selectedItem``` parameter, so clean knockout based patterns can be followed easily. ```selectedItem``` is the only paramater that must always be passed, containing an observable.

## Adaptive Input

Instead of providing data using the ```data``` paramater in the select2 object, data can also be passed using the ```itemsSource``` parameter in this binding. The autocomplete ```itemsSource``` parameter accepts an array that contains either strings or objects. If the array contains strings, autocomple will map it correctly for select2 and take care of all the details. If the array contains objects, the ```textpath``` parameter must be sent to specify the property of the object that containts the string to be rendered if no template is provided. Likewise, the ```idpath``` parameter must be provided to specify which property contains the data returned on selection, else the entire object will be the selected value.

## Hierarchical Data

This extension supports infinite levels of hierarchical data. Simply specify a ```childpath``` as a string or array of strings, and the binding will indent and layer each level of your data.

## Dynamic Data Loading

The ```itemsSource``` parameter instead of taking an array can also take an observable. If an observable is passed, before every search the binding will get the most updated value it contains and use that to search from.

## Viewmodel Filtering

All filtering can be done in the viewmodel without passing any functions to select2. If the parameter ```customFiltering``` is set to ```true```, then the results of the dropdown will be exactly what is currently in the ```itemsSource```, and can be easily created as a computed function depending on ```userInput```.

# Examples

## Simplest Binding

```javascript
autocomplete: {
    itemsSource = ['a', 'b', 'c'],
    selectedItem = this.anyObservable
}
```

## Complex Binding

```javascript
autocomplete: {
    select2: {
        placeholder: 'Placeholder Text',
        allowClear: true
    },
    selectedItem: this.someObservable,
    userInput: this.anotherObservable,
    itemsToShow: this.computedFilteringFunction,
    textpath: 'textproperty',
    idpath: 'idproperty'
}
```

<div id="autocomplete-example" ></div>



# Installation

Just install [this nuget package](https://www.nuget.org/packages/scalejs.autocomplete-select2/)

# Browser Compatibility

* IE 8+
* Chrome 8+
* Firefox 10+
* Safari 3+
* Opera 10.6+
<script source="./"