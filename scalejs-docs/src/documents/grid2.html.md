---
title: "Layout"
isPage: true
---

<link href="grid/slick/slick.grid.css" rel="stylesheet" type="text/css" />
<link href="grid/slick/slick-default-theme.css" rel="stylesjeet" type="text/css" />
<script src="grid/Grid-1.0.2.min.js" type="text/javascript"></script>
# Grid Filtering

<hr>

[Grid Live Sample](http://scalejs.com/scalejs-examples/Grid/) |
[Grid on GitHub](https://github.com/lisovin/scalejs-examples/tree/master/Grid)

<hr>


In this section we will show you how to add filtering capabilities to your [grid](https://github.com/lisovin/scalejs-examples/tree/grid-1/Grid). 
In order to do this, you should already have a grid in your application. 
You can learn how to add a grid to your application in the [grid introduction](./grid1.html) tutorial.

Filtering can be done in two ways. You can either use the default filtering which comes with the extension,
or you can filter the items yourself. The benefit to the latter is that you have full
control over the data in the grid - meaning you have the option to implement filtering on the server. 

You can view this code on [github](https://github.com/lisovin/scalejs-examples/tree/grid-2/Grid)
or clone [scalejs-examples repository](https://github.com/lisovin/scalejs-examples) and running the following command:

`git checkout grid-2`

<br>

## Filter Overview

The filtering control gives you many different ways of filtering the data.

![filter1](./filter2.png)

In this picture, we have highlighted 4 aspects of the filter. The filter itself can be opened by
clicking on the filter icon (pictured within the quick filter box).

1. __Quick Filter:__ an input box on the header that can be used to quickly filter data
2. __Quick Search:__ an input box within the filter which allows you to narrow the options displayed within the list
3. __List:__ a list of values which can be checked or unchecked.
The grid will only show rows which contain the selected items in the list. 
If all of the items are selected and there is a quick search enter, the filter behaves as if a
quick filter is entered.
4. __Value:__ this will filter based upon conditions and values. For strings, the conditions are
_contains_, _starts with_, and _ends with_. For numbers, the conditions are _equal to_, _greater than_, _less than_, and _not equal to_.
There is also an option to remove any data which contains an empty value for that column by checking _are not empty_.

When setting a value, selecting items in the list, or typing in a quick filter,
 it resets other filters for that column. For example, if you have an item checked, and then decided to enter a value,
your list selection would be removed.

<br>

## Filter Configuration

There are a few changes you will need to make to the bindings and your columns in order to enable filtering.
In your bindings, you will need to show the header row (the row which contains the quick filter and the icon)
and also tell the extension to include the 'observableFilters' plugin.

##### Example: adding filtering to grid bindings ([mainBindings.js](https://github.com/lisovin/scalejs-examples/blob/grid-2/Grid/app/main/bindings/mainBindings.js))
```javascript
/*global define */
/*jslint sloppy: true*/
define({
    'main-grid': function () {
        return {
            slickGrid: {
                columns: this.columns,
                itemsSource: this.itemsSource,
                enableColumnReorder: false,
                forceFitColumns: true,
                !!*showHeaderRow: true,
                plugins: {
                    'observableFilters': {}
                }**!
            }
        };
    }
});
```

The next thing which needs to be done is modifying your columns. 
You simply need to specify that there is a filter for that column, and pass it an object with some configuration information.
There are two types of filters - `string` and `number` - you will need to specify which one for each column.

##### Example: the viewmodel for itemsSource and columns ([mainViewModel.js](https://github.com/lisovin/scalejs-examples/blob/grid-2/Grid/app/main/viewmodels/mainViewModel.js))
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
            range = sandbox.linq.enumerable.range,
            observableArray = sandbox.mvvm.observableArray,
            ajaxGet = sandbox.ajax.jsonpGet,
            // vars
            columns,
            itemsSource = observableArray();

        function moneyFormatter(m) {
            return parseFloat(m).toFixed(2);
        }

        columns = [
            { id: "Symbol", field: "Symbol", name: "Symbol", minWidth: 75!!*, filter: { type: 'string' }**! },
            { id: "Name", field: "Name", name: "Name", minWidth: 300!!*, filter: { type: 'string' }**! },
            { id: "LastSale", field: "LastSale", name: "Last Sale", cssClass: "money", minWidth: 100!!*, filter: { type: 'number' }**! },
            { id: "MarketCap", field: "MarketCap", name: "Market Cap", cssClass: "money", minWidth: 150!!*, filter: { type: 'mumber' }**! },
            { id: "Sector", field: "Sector", name: "Sector", minWidth: 150!!*, filter: { type: 'string' }**! },
            { id: "Industry", field: "industry", name: "Industry", minWidth: 350!!*, filter: { type: 'string' }**! }];

        ajaxGet('./companylist.txt', {}).subscribe(function (data) {
            itemsSource(JSON.parse(data).map(function (company, index) {
                // each item in itemsSource needs an index
                company.index = index
                // money formatter
                company.LastSale = moneyFormatter(company.LastSale);
                company.MarketCap = moneyFormatter(company.MarketCap);
                return company;
            }));
        });

        return {
            columns: columns,
            itemsSource: itemsSource
        };
    };
});
```
<br>

## Filter Images and Styles

Include the images for the arrow and on/off state of the filter which can be found [here](https://github.com/lisovin/scalejs-examples/tree/grid-2/Grid/images).
Update your [main.less](https://github.com/lisovin/scalejs-examples/blob/grid-2/Grid/app/main/styles/main.less) file so that it contains styles for grids.

<br>

## Result

Here is the result of those changes.

<div id="grid1" style="width:100%;height:600px"></div>



