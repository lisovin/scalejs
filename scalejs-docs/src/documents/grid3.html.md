---
title: "Layout"
isPage: true
---

<link href="grid/slick/slick.grid.css" rel="stylesheet" type="text/css" />
<link href="grid/slick/slick-default-theme.css" rel="stylesjeet" type="text/css" />
<script src="grid/Grid-1.0.3.min.js" type="text/javascript"></script>
# Grid Sorting

<hr>

[Grid Live Sample](http://scalejs.com/scalejs-examples/Grid/) |
[Grid on GitHub](https://github.com/lisovin/scalejs-examples/tree/master/Grid)

<hr>

The sorting tutorial will show you how to add sorting to your grid.
This tutorial is a continuation of the previous tutorial on [grid filtering](./grid2.html).
You can implement either [default sorting](./grid3.html#default-sorting) or [viewmodel sorting](./grid3.html#viewmodel-sorting).
These two sections add on to the [default filtered grid](https://github.com/lisovin/scalejs-examples/tree/grid-2a/Grid)
or the [viewmodel filtered grid](https://github.com/lisovin/scalejs-examples/tree/grid-2b/Grid) respectively.

<br>

## Sorting Overview

Sorting your data is much more simple and straight forward than filtering.
By adding sorting, you can do the following:

* To sort a column, click on the header of the column. This will sort it either by Ascending or Descending. 
Click on it once again to sort it in the opposite direction.
* You can set which columns, by default, will be sorted and in which direction upon initialization.
* You can enable multi-column sort, which will alow you to sort your data by one column and then by another one.
Multiple columns can be sorted by holding the __shift__ key when clicking on the column headers to sort then.

<br>

## Default Sorting

Default sorting is provided by the grid if you do not wish to use your own sorting. 
This section ads on to the [grid](https://github.com/lisovin/scalejs-examples/tree/grid-2a/Grid) you created in the [default filtering](./grid2.html#default-filtering) tutorial.
You can view this code on [github](https://github.com/lisovin/scalejs-examples/tree/grid-3a/Grid)
or clone [scalejs-examples repository](https://github.com/lisovin/scalejs-examples) and running the following command:


`git checkout grid-3a`

<br>
### Columns

Life filtering, to enable sorting you only need to modify the columns.
You can enable specific columns by adding a `sort` property and setting it to `true`.
If you do not want specific columns to be sorted, omit this property.

Optionally, to set a default sort order for a column, 
and pass either `'asc'` or `'desc'` to the `sort` property instead of `true`.
This will sort that column in ascending order or descending order respectively when the grid is initialized.


##### Example: the viewmodel with the modified columns ([mainViewModel.js](https://github.com/lisovin/scalejs-examples/blob/grid-3a/Grid/app/main/viewmodels/mainViewModel.js))
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
            observableArray = sandbox.mvvm.observableArray,
            ajaxGet = sandbox.ajax.jsonpGet,
            // vars
            columns,
            itemsSource = observableArray();

        function moneyFormatter(m) {
            return parseFloat(m).toFixed(2);
        }

        columns = [
            { id: "Symbol", field: "Symbol", name: "Symbol", minWidth: 75, filter: { type: 'string' }, !!*sort: 'asc'**! },
            { id: "Name", field: "Name", name: "Name", minWidth: 300, filter: { type: 'string' }, !!*sort: true**! },
            { id: "LastSale", field: "LastSale", name: "Last Sale", cssClass: "money", minWidth: 100, filter: { type: 'number' }, !!*sort: true**! },
            { id: "MarketCap", field: "MarketCap", name: "Market Cap", cssClass: "money", minWidth: 150, filter: { type: 'mumber' }, !!*sort: true**! },
            { id: "Sector", field: "Sector", name: "Sector", minWidth: 150, filter: { type: 'string' }, !!*sort: true**! },
            { id: "Industry", field: "industry", name: "Industry", minWidth: 350, filter: { type: 'string' }, !!*sort: true**! }];

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
### MultiColumn Sort

Optionally, if you would like to enable multi-column sort, add a `multiColumnSort` property to the bindings and set it to `true`.

##### Example: adding sorting to grid bindings ([mainBindings.js](https://github.com/lisovin/scalejs-examples/blob/grid-3a/Grid/app/main/bindings/mainBindings.js))
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
                rowHeight: 40,
                showHeaderRow: true,
                !!*multiColumnSort: true;**!
            }
        };
    }
});
```

Whether you are using the default sorting, or using your ViewModel to sort, your [images and styles](./grid3.html#images-and-styles)
and the [result](./grid3.html#result) will be the same.
<br>

## Sorting Images and Styles

Include the images for the ascending and descending arrows can be found in the grid styles, [here](https://github.com/lisovin/scalejs-examples/tree/grid-3a/Grid/css/slick/images).
Update your [main.less](https://github.com/lisovin/scalejs-examples/blob/grid-3a/Grid/app/main/styles/main.less) file so that it contains styles for grids.

<br>

## Result

Here is the result of those changes.

<div id="grid1" style="width:100%;height:600px"></div>



