---
title: "ScaleJS Docs"
isPage: true
styles: ["highlight.css"]
---

<script src="visualization/visualizationdemo-1.0.1.js" type="text/javascript"></script>

# Visualizations

An autocomplete extension for scalejs based on [D3](http://d3js.org/). This extension provides a way to use select2 and many of its advanced features while still following scalejs patterns. The code is freely available on [GitHub](https://github.com/lisovin/scalejs.visualization-d3).


<div id="visualization-example" ></div>



## Examples

### Simple Binding

```javascript
sunburst: {
    data: this.data,
    idPath: 'name',
    colorPath: this.colorPath,
    colorPalette: this.colorPalette,
    enableZoom: true,
}
```

### Complex Binding

```javascript
visualizations: {
    type: this.type,
    data: this.data,
    maxVisibleLevels: this.maxVisibleLevels,
    levels: [{
        colorPalette: ["#88ff88", "#00ff00", "#008800"]
    }, {
        colorPalette: ["#ff8888", "#ff0000", "#880000"]
    }, 'children', {
        childrenPath: 'children',
        colorPalette: this.colorPalette2
    }, {
        colorPalette: 'PRGn'
    }, {
        colorPalette: ["#d7191c", "#fdae61", "#ffffbf", "#a6d96a", "#1a9641"]   //'RdYlGn'
    }],
    idPath: 'name',
    childrenPath: 'children',
    areaPath: this.areaPath,
    colorPath: this.colorPath,
    colorPalette: this.colorPalette,
    zoomedItemPath: this.zoomedItemPath,
    selectedItemPath: this.selectedItemPath,
    heldItemPath: this.heldItemPath,
    enableZoom: true,
    enableTouch: true,
    sortBy: this.sortBy,
    fr: 5,
    parentFr: 1 / 2,
    levelsFr: [1, 1, 1, 1]
}
```


## Features

### Dynamic Visualization Switching

The same data can be rendered using multiple visualizations that can be switched in real time by pushing the names of different visualizations into an observable bound to the ```type``` property.

### Observable Output

The user's selection is returned to the viewmodel through the knockout observable bound to the ```selectedItem``` parameter, so clean knockout based patterns can be followed easily. ```selectedItem``` is the only paramater that must always be passed, containing an observable.

### Adaptive Input

Instead of providing data using the ```data``` paramater in the select2 object, data can also be passed using the ```itemsSource``` parameter in this binding. The autocomplete ```itemsSource``` parameter accepts an array that contains either strings or objects. If the array contains strings, autocomple will map it correctly for select2 and take care of all the details. If the array contains objects, the ```textpath``` parameter must be sent to specify the property of the object that containts the string to be rendered if no template is provided. Likewise, the ```idpath``` parameter must be provided to specify which property contains the data returned on selection, else the entire object will be the selected value.

### Hierarchical Data

This extension supports infinite levels of hierarchical data. Simply specify a ```childrenPath``` as a string, and the binding will parse your data and display all levels  possible.

### Dynamic Data Loading

The ```data``` parameter instead of taking an array can also take an observable. If an observable is passed, before every search the binding will get the most updated value it contains and use that to search from.


## Installation

Just install [this nuget package](https://www.nuget.org/packages/scalejs.visualization-d3/)