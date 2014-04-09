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


Now that you have created the grid and added [filtering](https://github.com/lisovin/scalejs-examples/tree/grid-3/Grid)
capabilities, we will show you how to add sorting as well. This tutorial should be done after completing
 the [grid filtering](./grid2.html) tutorial.

Sorting, like filtering can be done in two ways. You can either use the default sorting which comes with the extension,
or you can sort the items yourself. The benefit to the latter is that you have full
control over the data in the grid - meaning you have the option to implement sorting on the server. 

You can view this code on [github](https://github.com/lisovin/scalejs-examples/tree/grid-3/Grid)
or clone [scalejs-examples repository](https://github.com/lisovin/scalejs-examples) and running the following command:

`git checkout grid-3`

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

## Sorting Configuration

Like filtering, there are a few changes you will need to make to the bindings and your columns in order to enable sorting.
In your bindings, you will need to add a new option, `sorting`, and set it to `true`.

Optionally, if you would like to enable multi-column sort, add a `multiColumnSort` property and set it to `true`.

##### Example: adding sorting to grid bindings ([mainBindings.js](https://github.com/lisovin/scalejs-examples/blob/grid-3/Grid/app/main/bindings/mainBindings.js))
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
                !!*sorting: true,
                multiColumnSort: true,**!
                plugins: {
                    'observableFilters': {}
                }
            }
        };
    }
});
```

The next thing which needs to be done is modifying your columns in a similar fashion.
You can enable specific columns by adding a `sortable` property and setting it to `true`.
If you do not want specific columns to be sorted, omit this property.

Optionally, to set a default sort, you must pass an aditional option called `defaultSort`
and pass either `'asc'` or `'desc'`, which will sort that column in ascending order or descending order respectively.
If you have multi-column sort enabled, you can apply this property to multiple columns.


##### Example: the viewmodel for itemsSource and columns ([mainViewModel.js](https://github.com/lisovin/scalejs-examples/blob/grid-3/Grid/app/main/viewmodels/mainViewModel.js))
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
            { id: "Symbol", field: "Symbol", name: "Symbol", minWidth: 75, filter: { type: 'string' }, !!*sortable: true, defaultSort: 'asc'**! },
            { id: "Name", field: "Name", name: "Name", minWidth: 300, filter: { type: 'string' }, !!*sortable: true**! },
            { id: "LastSale", field: "LastSale", name: "Last Sale", cssClass: "money", minWidth: 100, filter: { type: 'number' }, !!*sortable: true**! },
            { id: "MarketCap", field: "MarketCap", name: "Market Cap", cssClass: "money", minWidth: 150, filter: { type: 'mumber' }, !!*sortable: true**! },
            { id: "Sector", field: "Sector", name: "Sector", minWidth: 150, filter: { type: 'string' }, !!*sortable: true**! },
            { id: "Industry", field: "industry", name: "Industry", minWidth: 350, filter: { type: 'string' }, !!*sortable: true**! }];

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

## Sorting Images and Styles

Include the images for the ascending and descending arrows can be found in the grid styles, [here](https://github.com/lisovin/scalejs-examples/tree/grid-3/Grid/css/slick/images).
Update your [main.less](https://github.com/lisovin/scalejs-examples/blob/grid-3/Grid/app/main/styles/main.less) file so that it contains styles for grids.

<br>

## Result

Here is the result of those changes.

<div id="grid1" style="width:100%;height:600px"></div>



