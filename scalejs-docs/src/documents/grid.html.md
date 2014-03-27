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

You can see the code associated with each of the following sections by checking out the appropriate tag in the __scalejs-examples__ repository.

<br>

## Getting the Grid extension

Install __scalejs.grid-slick__ from NuGet to get the necessary files for the Grid.
Included in these files are the CSS files needed for the grid to function, as well as a default theme.
You must add a link to these files in you index.html, index.debug.html, and index.release.html files 
for the grid to work. You can also modify __slick-default-theme.css__ to create your own grid styles.

##### Example: Including the CSS files in index.html
```xml
<!DOCTYPE html>
<html>
    <head>
        !!*<link href="css/slick/slick.grid.css" rel="stylesheet" type="text/css" />
        <link href="css/slick/slick-default-theme.css" rel="stylesjeet" type="text/css"/>**!
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
