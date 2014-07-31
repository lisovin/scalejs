---
title: "Layout"
isPage: true
---

<link href="grid/slick/slick.grid.css" rel="stylesheet" type="text/css" />
<link href="grid/slick/slick-default-theme.css" rel="stylesjeet" type="text/css" />
<script src="grid/Grid-1.0.0.min.js" type="text/javascript"></script>

# Grid Introduction


<hr>

[Grid Live Sample](http://scalejs.com/scalejs-examples/Grid/) |
[Grid on GitHub](https://github.com/lisovin/scalejs-examples/tree/master/Grid)

<hr>

One of the UI Components you can install and use in your scalejs projects is a __grid__ which, in its most basic form, displays data in rows and columns.
This page will detail how to include the grid in your project. 
Our extension is adapted from the [SlickGrid](https://github.com/mleibman/SlickGrid) library created by [Michael Leibman](https://github.com/mleibman).
The reason we decided to use SlickGrid was because it is a high performance library which supports customization, virtual scrolling, and other great features.

## Example

Once you add [styles](./grid1.html#styles) your grid will look like this:

<div id="grid1" style="width:100%;height:600px"></div>

You can view this code on [github](https://github.com/lisovin/scalejs-examples/tree/grid-1/Grid)
or clone [scalejs-examples repository](https://github.com/lisovin/scalejs-examples) and running the following command:

`git checkout grid-1`

<br>

## Getting the Grid extension

Install __scalejs.grid-slick__ from NuGet to get the necessary files for the grid.
Included in these files are the CSS files needed for the grid to function, as well as a default theme.
You must add a link to these files in you index.html, index.debug.html, and index.release.html files 
for the grid to work. You can also modify __slick-default-theme.css__ to create your own grid styles.
In our example we also included a global stylesheet to specify styles for the page.

##### Example: Including the CSS files in index.html
```xml
<!DOCTYPE html>
<html>
    <head>
        !!*<link href="css/slick/slick.grid.css" rel="stylesheet" type="text/css" />
        <link href="css/slick/slick-default-theme.css" rel="stylesheet" type="text/css"/>
		 <link href="css/global.css" rel="stylesheet" type="text/css" />**!
        <script src="config.js" type="text/javascript"></script>
        <script src="Scripts/require.js" data-main="app/app" type="text/javascript"></script>
        <title>Grid application (development version).</title>
    </head>
    <body>
    </body>
</html>
```

<br>

## Creating a Grid

Checkout the [grid-1](https://github.com/lisovin/scalejs-examples/tree/grid-1) tag in order to view the code for this section. (or run `git checkout grid-1`)

In order to create a grid, you need 3 things: an element in the __view__ to bind to, various __bindings__
to set the behavior of the control, and the __viewmodel__ for your data, columns, and other grid features.
You also need to create some __styles__ to determine how the grid looks, but that is less important.
The easiest out of these to code is the view, which in our example, is specified within main.html.

##### Example: the view for our grid ([main.html](https://github.com/lisovin/scalejs-examples/blob/grid-1/Grid/app/main/views/main.html))
```xml
<div id="main_template">
    <div class="main grid" data-class="main-grid"></div>
</div>
```

Here you can see we have given this element a _data-class_ called `main-grid`. 
We will define this class in the _mainBindings.js_ class as the following:

##### Example: the bindings for our grid ([mainBindings.js](https://github.com/lisovin/scalejs-examples/blob/grid-1/Grid/app/main/bindings/mainBindings.js))
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
                rowHeight: 40
            }
        };
    }
});
```

`columns` is an array that specifies your columns. We will cover this in more detail in the viewmodel.

`itemsSource` is also an array which specifies the data. This will also be covered in the viewmodel.

`enableColumnReorder` must be set to false for now. It disables re-ordering of the columns via drag-and-drop.
This will be implemented in a later version of our extension, but for now you must __explicitly__ set it to false.

`forceFitColumns` is an optional parameter which tells the grid to expand its width to fit its parent's width.

`rowHeight` is also an optional parameter which will specify the height of the rows in pixels.

For more options which can be passed to the slick grid, you can look at [slick-grid options](https://github.com/mleibman/SlickGrid/wiki/Grid-Options).

Now we need to specify the columns and itemsSource in the viewmodel.
For this section, we installed the __scalejs.ajax-jquery__ extension as we recieve our data from an external source.
In this case, it is a file with a list of companies specified in JSON. You can get the file with the codesource.

##### Example: the viewmodel for itemsSource and columns ([mainViewModel.js](https://github.com/lisovin/scalejs-examples/blob/grid-1/Grid/app/main/viewmodels/mainViewModel.js))
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
            { id: "Symbol", field: "Symbol", name: "Symbol", minWidth: 75 },
            { id: "Name", field: "Name", name: "Name", minWidth: 300 },
            { id: "LastSale", field: "LastSale", name: "Last Sale", cssClass: "money", minWidth: 100 },
            { id: "MarketCap", field: "MarketCap", name: "Market Cap", cssClass: "money", minWidth: 150 },
            { id: "Sector", field: "Sector", name: "Sector", minWidth: 150 },
            { id: "Industry", field: "industry", name: "Industry", minWidth: 350}];

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
            itemsSource: itemsSource
        };
    };
});
```

In our viewmodel we can see that `columns` is an array of objects that contain three required properties: `id`, `field` and `name`.
`id` is a unique identifier, `field` is the name of the property that is used by itemsSource,
and `name` is the name of the column in the view. 
Each column may also contain optional properties, such as `minWidth` (which sets the minimum width for the column in pixels)
and `cssClass` (which gives that column a class). `cssClass` is used to give the money columns `text-align: right`. 

We can also see that our itemsSource can be taken straight from the external source with only a slight modification.
This is because each item in the array has properties (keys) which map to the field of the column. 
Each item contains (at least) the following properties: Symbol, Name, LastSale, MarketCap, Sector, and Industry.
Also note since we are using JavaScript that it is case sensitive. The only modification our ViewModel makes to the data from the source
is parsing the number for the _LastSale_ and _MarketCap_ columns and giving it a fixed number of decimal places.

### Styles

After implementing the code snippets above you might want to make your grid look nice.
In order to do this make sure to grab the [global styles](https://github.com/lisovin/scalejs-examples/blob/grid-1/Grid/css/global.css)
and the [main.less](https://github.com/lisovin/scalejs-examples/blob/grid-1/Grid/app/main/styles/main.less) file. 
You might also want to include the [fonts](https://github.com/lisovin/scalejs-examples/tree/grid-1/Grid/fonts) we are using.

In our grid styles, we specified the height of the grid to be 100%. 
A set height is required (or 100%), otherwise, the grid component wont know how many rows to show, and it wont utilize row virtualization.


