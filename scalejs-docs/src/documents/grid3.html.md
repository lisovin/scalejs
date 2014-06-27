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

### Bindings

The first change you need to make is in the bindings. Modify the bindings so there is a `sorting` property exposed.
This can be bound to __true__ for default sorting, but the downside to that is you cannot specify the initial sort
or modify the sorted columns from the ViewModel. In our example, we will bind it to a `sorting` observable in the ViewModel.

Optionally, you can set the `multiColumnSort` property to true to enable the ability to sort multiple columns.

##### Example: changing the bindings ([mainBindings.js](https://github.com/lisovin/scalejs-examples/blob/grid-3a/Grid/app/main/bindings/mainBindings.js))
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
                showHeaderRow: true!!*,
                sorting: this.sorting,
                multiColumnSort: true**!
            }
        };
    }
});

```

### ViewModel

In our ViewModel, we need to do 2 things. First, we must expose the observable we bound to the `sorting` property in the bindings.
Second, we must add `sortable: true` to all the columns we wish to be sortable. In this example, we wanted all of the columns to be sortable
so we iterated through each one using `forEach` and added the property there. We also set an initial sort order in the `sorting` observable. 

##### Example: changing the ViewModel ([mainViewModel.js](https://github.com/lisovin/scalejs-examples/blob/grid-3a/Grid/app/main/viewmodels/mainViewModel.js))
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
            observable = sandbox.mvvm.observable,
            ajaxGet = sandbox.ajax.jsonpGet,
            // vars
            columns,
            itemsSource = observableArray()!!*,
            sorting = observable({ Symbol: true });**!

        function moneyFormatter(m) {
            return parseFloat(m).toFixed(2);
        }

        columns = [
            { id: "Symbol", field: "Symbol", name: "Symbol", minWidth: 75, filter: { type: 'string' } },
            { id: "Name", field: "Name", name: "Name", minWidth: 300, filter: { type: 'string', quickFilterOp: 'Contains' } },
            { id: "LastSale", field: "LastSale", name: "Last Sale", cssClass: "money", minWidth: 100, filter: { type: 'number' } },
            { id: "MarketCap", field: "MarketCap", name: "Market Cap", cssClass: "money", minWidth: 150, filter: { type: 'mumber' } },
            { id: "Sector", field: "Sector", name: "Sector", minWidth: 150, filter: { type: 'string' } },
            { id: "Industry", field: "industry", name: "Industry", minWidth: 350, filter: { type: 'string', quickFilterOp: 'Contains' } }];


        !!*columns.forEach(function (c) {
            c.sortable = true;
        });**!

        ajaxGet('./companylist.txt', {}).subscribe(function (data) {
            itemsSource(JSON.parse(data).map(function (company) {
                // money formatter
                company.LastSale = moneyFormatter(company.LastSale);
                company.MarketCap = moneyFormatter(company.MarketCap);
                return company;
            }));
        });

        return {
            columns: columns,
            itemsSource: itemsSource!!*,
            sorting: sorting**!
        };
    };
});

```
<br>

## Sorting Images and Styles

Include the images for the ascending and descending arrows can be found in the grid styles, [here](https://github.com/lisovin/scalejs-examples/tree/grid-3a/Grid/css/slick/images).
Update your [main.less](https://github.com/lisovin/scalejs-examples/blob/grid-3a/Grid/app/main/styles/main.less) file so that it contains styles for grids.

<br>

## Result

Here is the result of those changes.

<div id="grid1" style="width:100%;height:600px"></div>



