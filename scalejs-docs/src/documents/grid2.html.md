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

Filtering can be done in two ways. You can either use the [default filtering](./grid2.html#default-filtering) which comes with the extension,
or you can use [viewmodel filtering](./grid2.html#viewmodel-filtering). The benefit to the latter is that you have full
control over the data in the grid - meaning you have the option to implement filtering on the server. 

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

## Default Filtering

If you do not wish to implement your own filtering, you may use the filtering provided by the extension.
This requires minimal work on your part. You can view this code on [github](https://github.com/lisovin/scalejs-examples/tree/grid-2a/Grid)
or clone [scalejs-examples repository](https://github.com/lisovin/scalejs-examples) and running the following command:

`git checkout grid-2a`

### Bindings

There are a few changes you will need to make to the bindings and your columns in order to enable filtering.
In your bindings, you will need to show the header row (the row which contains the quick filter and the icon)
and also tell the extension to include the 'observableFilters' plugin.

##### Example: adding default filtering to grid bindings ([mainBindings.js](https://github.com/lisovin/scalejs-examples/blob/grid-2a/Grid/app/main/bindings/mainBindings.js))
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

### ViewModel

The next thing which needs to be done is modifying your columns. 
You simply need to specify that there is a filter for that column, and pass it an object with some configuration information.
There are two types of filters - `string` and `number` - you will need to specify which one for each column.
You may also specify a `quickFilterOp` property to change the default filtering of the quick filter.
By default, it uses `StartsWith`, but you can specify `Contains`.

##### Example: the viewmodel for itemsSource and columns ([mainViewModel.js](https://github.com/lisovin/scalejs-examples/blob/grid-2a/Grid/app/main/viewmodels/mainViewModel.js))
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
            { id: "Name", field: "Name", name: "Name", minWidth: 300!!*, filter: { type: 'string', quickFilterOp: 'Contains' }**! },
            { id: "LastSale", field: "LastSale", name: "Last Sale", cssClass: "money", minWidth: 100!!*, filter: { type: 'number' }**! },
            { id: "MarketCap", field: "MarketCap", name: "Market Cap", cssClass: "money", minWidth: 150!!*, filter: { type: 'mumber' }**! },
            { id: "Sector", field: "Sector", name: "Sector", minWidth: 150!!*, filter: { type: 'string' }**! },
            { id: "Industry", field: "industry", name: "Industry", minWidth: 350!!*, filter: { type: 'string', quickFilterOp: 'Contains' }**! }];

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

Whether you are using the default filtering, or using your ViewModel to filter, your [images-and-styles](./grid2.html#images-and-styles)
and the [result](./grid2.html#result) will be the same.

<br>

## ViewModel Filtering

If instead of using the default filtering you would like to implement your own, you can do that too.
This is advantageous if you would rather do filtering on the server. 
For simplicity, our example will do the filtering within the ViewModel, but it would not be much different if you were to do it on the server.

You can view this code on [github](https://github.com/lisovin/scalejs-examples/tree/grid-2b/Grid)
or clone [scalejs-examples repository](https://github.com/lisovin/scalejs-examples) and running the following command:

`git checkout grid-2b`

### Bindings

The changes to the bindings for ViewModel filtering similar to the ones for [default filtering](./default-filtering.html).
In your bindings, you will need to show the header row (the row which contains the quick filter and the icon)
and also tell the extension to include the 'observableFilters' plugin. __You must also specify a `itemsCount` property.__
This is because once we have enabled ViewModel filtering or sorting, we also have control of how many items are in the grid
regardless of how many items there is. This will allow us to implement [virtualization](./grid4.html) in a future tutorial.

##### Example: adding ViewModel filtering to grid bindings ([mainBindings.js](https://github.com/lisovin/scalejs-examples/blob/grid-2b/Grid/app/main/bindings/mainBindings.js))
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
                },
                itemsCount: this.itemsCount**!
            }
        };
    }
});
```

### ViewModel

Filtering must also be enabled on the columns themselves. This is more complex than the default filtering because
you must specify observables for the filter to use. 

##### Example: the observables that need to be defined for ViewModel filtering
```javascript
{
    value: observable(), // contains the value of the filter
    quickSearch: observable(), // contains the value of the quickSearch
    values: observableArray() // displays the result of the quickSearch
};
```

For the sake of simplicity, we will only have a filter on the __Symbol__ column. 
Since we do not have a backend service to do the filtering for us, we will do the filtering on the ViewModel.
ViewModel filters also need a `type` propery which can be `string` or `number`, and optionally, it can be passed a `quickFilterOp`.

__Note: do not mix in default filtering with ViewModel filtering.__

The value in the `value` and the `quickSearch` observable will __always be an array__ which is either empty
or contains 1 of more of objects with the following format

##### Example: what to expect from values and quickSearch
```javascript
{
	op: <a string with `StartsWith`, `Contains`, `EndsWith`, etc>
	values: [<an array with the values of the operation>]
}
```

When implementing filtering, make sure to be careful about types and case.

##### Example: the viewmodel for itemsSource and columns ([mainViewModel.js](https://github.com/lisovin/scalejs-examples/blob/grid-2b/Grid/app/main/viewmodels/mainViewModel.js))
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
            !!*observable = sandbox.mvvm.observable,**!
            // vars
            columns,
            itemsSource = observableArray()!!*,
            itemsCount = observable(),
            evaluate,
            companies;**!
   
        !!*// creates observables needed for filter
        function createFilter(type) {
            return {
                type: type,
                value: observable(), // contains the value of the filter
                quickSearch: observable(), // contains the value of the quickSearch
                values: observableArray() // displays the result of the quickSearch
            };
        }**!

        function moneyFormatter(m) {
            return parseFloat(m).toFixed(2);
        }

        columns = [
            { id: "Symbol", field: "Symbol", name: "Symbol", minWidth: 75, !!*filter: createFilter('string')**! },
            { id: "Name", field: "Name", name: "Name", minWidth: 300 },
            { id: "LastSale", field: "LastSale", name: "Last Sale", cssClass: "money", minWidth: 100 },
            { id: "MarketCap", field: "MarketCap", name: "Market Cap", cssClass: "money", minWidth: 150 },
            { id: "Sector", field: "Sector", name: "Sector", minWidth: 150 },
            { id: "Industry", field: "industry", name: "Industry", minWidth: 350 }];

        ajaxGet('./companylist.txt', {}).subscribe(function (data) {
            !!*// maintain original companies for filtering
            companies = JSON.parse(data).map(function (company, index) {**!
                // each item in itemsSource needs an index
                company.index = index;
                // money formatter
                company.LastSale = moneyFormatter(company.LastSale);
                company.MarketCap = moneyFormatter(company.MarketCap);
                return company;
            });

            !!*itemsCount(companies.length);
            itemsSource(companies);**!
        });
		
        !!*// functions needed for string filter
        evaluate = {
            In: function (s, v) { return v.indexOf(s) !== -1; },
            Contains: function (s, v) { return s.indexOf(v[0]) !== -1; },
            StartsWith: function (s, v) { return s.indexOf(v[0]) === 0; },
            EndsWith: function (s, v) { return s.indexOf(v[0], s.length - v.length) !== -1; },
            NotEmpty: function(s) { return s !== ""}
        }**!

        !!*function upperCase(value) {
            return value.map(function (v) {
                return v.toUpperCase();
            });
        }**!

        !!*// filter is defined on the first column
        columns[0].filter.value.subscribe(function (v) {
            // v is an array with objects { op: <filterOperation>, values: [<valuesArray>] }
            if (v.length === 0) {
                // there are no filters
                itemsCount(companies.length);
                itemsSource(companies);
                return;
            }

            // filtering
            var filteredItems = v.reduce(function (items, filter) {
                return items.filter(function (item) {
                    return evaluate[filter.op](item.Symbol, upperCase(filter.values))
                });
            }, companies).map(function(item, index) {
                // need to set new index
                item.index = index;
                return item;
            });
            itemsCount(filteredItems.length);
            itemsSource(filteredItems);
        });**!

        !!*// need to also set the list items
        columns[0].filter.quickSearch.subscribe(function (q) {
            if (q.length === 0) {
                columns[0].filter.values(companies.take(50).toArray());
            } else {
                columns[0].filter.values(companies
                    .map(function(c) { return c.Symbol; })
                    .where(function (c) { return evaluate.StartsWith(c, upperCase(q.values)); })
                    .take(50).toArray());
            }
        });**!

        return {
            columns: columns,
            itemsSource: itemsSource!!*,
            itemsCount: itemsCount**!
        };
    };
});
```

Whether you are using the default filtering, or using your ViewModel to filter, your [images-and-styles](./grid2.html#images-and-styles)
and the [result](./grid2.html#result) will be the same. 

<br>
## Images and Styles

Include the images for the arrow and on/off state of the filter which can be found [here](https://github.com/lisovin/scalejs-examples/tree/grid-2a/Grid/images).
Update your [main.less](https://github.com/lisovin/scalejs-examples/blob/grid-2a/Grid/app/main/styles/main.less) file so that it contains styles for grids.

<br>

## Result

Here is the result of adding filtering.

<div id="grid1" style="width:100%;height:600px"></div>



