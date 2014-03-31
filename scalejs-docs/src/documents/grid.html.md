---
title: "Layout"
isPage: true
---

# Grid

<hr>

<!--
[Grid Layout Sample](http://scalejs.com/scalejs-examples/CssGridLayout/CssGridLayout/) |
[Grid Layout GitHub](https://github.com/lisovin/scalejs-examples/tree/master/CssGridLayout)

<hr>
-->

One of the UI Components you can install and use in your scalejs projects is a __grid__ which displays data in rows and columns. 
This page will detail how to include the grid in your project and enable features such as filtering and sorting. 
Our extension is adapted from the [SlickGrid](https://github.com/mleibman/SlickGrid) extensions.

You can see the code associated with each of the following sections by checking out the appropriate tag in the __scalejs-examples__ repository.

<br>

## Getting the Grid extension

Install __scalejs.grid-slick__ from NuGet to get the necessary files for the Grid.
Included in these files are the CSS files needed for the grid to function, as well as a default theme.
You must add a link to these files in you index.html, index.debug.html, and index.release.html files 
for the grid to work. You can also modify __slick-default-theme.css__ to create your own grid styles.
In our example we also included a global stylesheet to specify styles for the page and grid.

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

Checkout the [grid-1](https://github.com/lisovin/scalejs-examples/tree/grid-1) tag in order to view the code for this section.

In order to create a grid, you need 3 things: an element in the __view__ to bind to, various __bindings__
to set the behavior of the control, and the __viewmodel__ for your data, columns, and other grid features.
You also need to create some __styles__ to determine how the grid looks, but that is less important.
 our example, we are creating a full-screen grid,
but we can also create grids as children to other elements, or put grids within a [css layout grid](./gridlayout.html).
The easiest out of these to code is the view, which in our example, is specified within main.html.

##### Example: the view for our grid (main.html)
```xml
<div id="main_template">
    <div class="main grid" data-class="main-grid"></div>
</div>
```

Here you can see we have given this element a _data-class_ called `main-grid`. 
We will define this class in the _mainBindings.js_ class as the following:

##### Example: the bindings for our grid (mainBindings.js)
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
                headerRowHeight: 40
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

##### Example: the viewmodel for itemsSource and columns (mainViewModel.js)
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

        columns = [
            { id: "Symbol", field: "Symbol", name: "Symbol" },
            { id: "Name", field: "Name", name: "Name", minWidth: 300 },
            { id: "LastSale", field: "LastSale", name: "Last Sale" },
            { id: "MarketCap", field: "MarketCap", name: "Market Cap", minWidth: 150 },
            { id: "Sector", field: "Sector", name: "Sector", minWidth: 150 },
            { id: "Industry", field: "industry", name: "Industry", minWidth: 200}];

        ajaxGet('./companylist.txt', {}).subscribe(function (data) {
            itemsSource(JSON.parse(data).map(function (company, index) {
                // each item in itemsSource needs an index
                company.index = index
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

In our viewmodel we can see that `columns` is an array of objects that contain three properties: `id`, `field` and `name`.
These are all required fields. `id` is a unique identifier, `field` is the name of the property that is used by itemsSource,
and `name` is the name of the column in the view.

We can also see that our itemsSource can be taken straight from the external source with only a slight modification.
This is because each item in the array has properties (keys) which map to the field of the column. 
Each item contains (at least) the following properties: Symbol, Name, LastSale, MarketCap, Sector, and Industry.
Also note since we are using JavaScript that it is case sensitive.

One thing which might be weird but is also __required__ for your grid to work is giving each item in itemsSource an index.
This index is leveraged in sorting, and allows the grid to maintain the order of the rows even as new data is added
and removed. This is why you must set an initial index of each item which can be done easily using `map`. 

### Styles

After implementing the code snippets above you might be wondering, why doesnt my grid look sexy? 
Thats because you havent used any styles. You can either clone the styles from the repository, or copy-paste them 
from here.

The first style is one which specifies the height of the grid to be 100%. This is because in our exmaple, we created a full-screen grid.
You must set a height for the grid, otherwise, the grid component wont know how many rows to show, and it wont utilize row virtualization.

##### Example: grid style in main.less
```css
.main {
    &.grid {
        height: 100%;
    }
}
```

Next, we have created a set of styles in __global.css__ to set the style of the page.
The first section, _global styles_, is applied to the html and the body and allows us to have a full-screen grid
by setting the width and height to 100%. __This is required in order for your grid to be a "full screen" grid__.
The rest of the styles specify what is needed for the grid, scrollbar, and fonts to look nice. 

##### Example: global styles for our application
```css
/* Global Styles */
html, body {
    width: 100%;
    height: 100%;
    margin: 0px;
    font-family: 'Segoe UI_', 'Open Sans', Verdana, Arial, Helvetica, sans-serif;
     background-color: #1b1b1b;
    color: orange;
}

/* Grid Styles */
.slick-header-column.ui-state-default {
    font-size: 16px;
    font-weight: bold;
    font-style: normal;
    border: 0px;
}

.slick-row.ui-widget-content, .slick-row.ui-state-active {
    font-size: 16px;
    line-height: 40px;
}

.slick-cell {
    border: 0px;
    padding: 0px 8px;
}

.slick-row.odd {   
    background-color: #121212; 

}

/* Scrollbar Styles*/

body   {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 10px;
    overflow-y: scroll;
    overflow-x: hidden;
}

html {
    overflow-y: auto;
    background-color: transparent;
}

::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

::-webkit-scrollbar-track-piece  {
     background-color: #1b1b1b;
}

::-webkit-scrollbar-thumb:vertical {
    height: 50px;
    background-color: orange;
    -webkit-border-radius: 6px;
}

/* Metro Fonts */
@font-face {
  font-family: "PT Serif Caption";
  font-style: normal;
  font-weight: 400;
  src: local("Cambria"), local("PT Serif Caption"), local("PTSerif-Caption"), url(https://themes.googleusercontent.com/static/fonts/ptserifcaption/v4/7xkFOeTxxO1GMC1suOUYWWhBabBbEjGd1iRmpyoZukE.woff) format('woff');
}
@font-face {
  font-family: "Open Sans Light";
  font-style: normal;
  font-weight: 300;
  src: local("Segoe UI Light"), local("Open Sans Light"), local("OpenSans-Light"), url(https://themes.googleusercontent.com/static/fonts/opensans/v6/DXI1ORHCpsQm3Vp6mXoaTZ1r3JsPcQLi8jytr04NNhU.woff) format('woff');
}
@font-face {
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  src: local("Segoe UI"), local("Open Sans"), local("OpenSans"), url(https://themes.googleusercontent.com/static/fonts/opensans/v6/K88pR3goAWT7BTt32Z01mz8E0i7KZn-EPnyo3HZu7kw.woff) format('woff');
}
@font-face {
  font-family: "Open Sans Bold";
  font-style: normal;
  font-weight: 700;
  src: local("Segoe UI Bold"), local("Open Sans Bold"), local("OpenSans-Bold"), url(https://themes.googleusercontent.com/static/fonts/opensans/v6/k3k702ZOKiLJc3WVjuplzJ1r3JsPcQLi8jytr04NNhU.woff) format('woff');
}

@font-face {
  font-family: 'metroSysIcons';
  src: url('../fonts/metroSysIcons.woff') format('woff'), url('../fonts/metroSysIcons.ttf') format('truetype'), url('../fonts/metroSysIcons.svg#metroSysIcons') format('svg');
  font-weight: normal;
  font-style: normal;
}
```








