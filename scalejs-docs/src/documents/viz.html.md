---
title: "Layout"
isPage: true
---

# Visualizations


<hr>

[Visualization Live Sample](http://scalejs.com/scalejs-examples/Visualizations/) |
[Visualization on GitHub](https://github.com/lisovin/scalejs-examples/tree/master/Visualizations)

<hr>

Intro to visualizations!

<br>

## Getting the Extension

Install blah blah

<br>

## Visualization Setup

### HTML and Styles

First, we need to create a view which contains a div to bind the visualization to. 
We also need to specify the width and height of the visualization.

//link stuff here

### Data Model

The model you will bind to your visualization has a flexible format. 
It must be a heirarchical data structure.
It needs to contain some meaningful information for the visualization to display.
The structure consists of levels which can be configured by the bindings.
Each node in a level needs to contain a unique identifier. 
This can be identified by the idPath which you can specify in the bindings.
By default, the id path is `id`. 
Each node can also have other information in it which could be used to determine its area, color, or children
once the visualization is rendered.


##### An example data model
```javascript
*{
    "name": "flare",
    "children": [{
        "name": "analytics",
        "children": [{
            "name": "cluster",
            "children": [{
                "name": "AgglomerativeCluster",
                "size": 3938,
                "x": 1,
                "none": 1
            }, {
                "name": "CommunityStructure",
                "size": 3812,
                "x": 2,
                "none": 1
            }, {
                "name": "HierarchicalCluster",
                "size": 6714,
                "x": 3,
                "none": 1
            }, {
                "name": "MergeEdge",
                "size": 743,
                "x": 4,
                "none": 1
            }]
        }]
    }]
}
```

The above example contains 4 levels of data. The id path in this example is `name`.
The above example also specifies its children, which is an array of nodes.
The property used to determine the children can also be specified by a custom path, the `childrenPath`.
Other paths which can be specified are `areaPath` and `colorPath` which will be described in the bindings section.

The important thing about this data structure is that it is configurable. We do not tell you what to name the properties
you'd like to bind to the id, name, children, area, or color. Rather, you can configure the binding so that it uses a custom path.
It can even use a custom path for each level of the structure. 

> give a link to the model

### Bindings

Now that you have a model, you are ready to create your bindings in order to render the visualization.
At a minimum, you will need to set the following bindings to see a visualization (treemap) on your screen.

##### Example: required bindings for a treemap visualization
```javascript
/*global define */
/*jslint sloppy: true*/
define({
    'main-viz': function () {
        return {
            d3: {
                visualization: 'treemap',
                data: this.model,
                idPath: 'name',
                areaPath: 'size',
                colorPath: 'x'
            }
        };
    }
});
```

This is the result:
<div id="viz1"></div>

Using the same binding with one small modification can yield a sunburst visualization.

##### Example: required bindings for a sunburst visualization
```javascript
/*global define */
/*jslint sloppy: true*/
define({
    'main-viz': function () {
        return {
            d3: {
                visualization: 'sunburst',
                data: this.model,
                idPath: 'name',
                areaPath: 'size',
                colorPath: 'x'
            }
        };
    }
});
```


## More stuff

### define the levels
### custom vs built in palettes
### sorting and custom sorting
### Enable rotate, touch, and zoom (events)
### Item Paths (zoomed item path, selected item path, held item path)
### Using observerables for parameters
### Sunburst specific parameters


## Treemap

## Sunburst

## Bindings