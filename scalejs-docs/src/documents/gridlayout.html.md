---
title: "Layout"
isPage: true
---

# Grid Layout

<hr>

[Grid Layout Sample](http://scalejs.com/scalejs-examples/CssGridLayout/CssGridLayout/) |
[Grid Layout GitHub](https://github.com/lisovin/scalejs-examples/tree/master/CssGridLayout)

<hr>

One of the most frustrating aspects of developing in HTML5 is creating the layout of your app.
Due to the nature of CSS, conceptually simple layouts are hard, and complex layouts are near impossible.
We decided to adopt the [CSS Grid Layout Module](http://www.w3.org/TR/css-grid-1/) pattern by
creating a polyfill of Microsoft's Grid Layout.
Although the polyfill can be used as a stand-alone script for basic HTML5 applications, here we will
explain how to use the CSS Grid Layout in your own scalejs app.

Install the __scalejs.layout-cssgrid__ extension with NuGet to import the __layout__ namespace.

<br>

## CSS/HTML that makes sense

Use CSS to create grids without the frustration of using CSS - the grid layout is very easy to grasp,
and does not take guess-work to position things correctly. 

If you developed for IE then you may already know how to use the `-ms-grid` styles attribute.

### A simple grid

This is a simple grid showing some of Grid Layout's basic features.

##### Example: the css for a simple grid
```css
/*GridLayoutStart*/
.tut-grid {
	height: 300px;
	width: 400px;
	display: -ms-grid;
	-ms-grid-columns: 2fr 1fr;
	-ms-grid-rows: 80px 1fr auto;
}
.tut-grid__header {
	-ms-grid-column-span: 2;
}
.tut-grid__text {
	-ms-grid-row: 3;
}
.tut-grid__spanned {
	-ms-grid-row: 2;
	-ms-grid-column: 2;
	-ms-grid-row-span: 2; 
}
.tut-grid__aligned {
	-ms-grid-row: 2;
	-ms-grid-column-align: end;
	-ms-grid-row-align: center;
}
/*GridLayoutEnd*/
```

##### Example: the html for a simple grid
```xml
<div class="tut-grid">
	<div class="tut-grid__spanned" style="background: blue;"></div>
	<div class="tut-grid__header" style="background: green;"></div>
	<div class="tut-grid__text" style="background: yellow;">I'm defining the height of this row!</div>
	<div class="tut-grid__aligned" style="background: red; width: 20px; height: 30px;"></div>
</div>
```

##### Result: 
![A simple grid](./grid_example.png)

_Note: The /*GridLayoutStart*/ and /*GridLayoutEnd*/ tags will be explained in the Using the Extension section below_

### How to organize your page

After [composing your UI](./composition.html) to contain all of the regions it needs, you can easily define where they are positioned
by applying some styles to them. 

##### Example: Regions in a view
```xml
<div id="main_template">
    <div id="main">
        <div id="left">Navigation</div>
        <div id="leftSplitter"></div>
        <div id="header">Header</div>
        <div id="headerSplitter"></div>
        <div id="content1">Content 1</div>
        <div id="footer">Footer</div>
    </div>
</div>
```

This UI contains some typical regions you'd expect to find in an app such as left section, a header, content, and a footer.  

Left Splitter and Header Splitter are margin areas which lie inbetween regions, but can also be [splitters](./gridlayout.html#splitters).

We will inspect the `#main` div and discuss how it sets up the Grid Layout.

##### Example: Setting up the Grid
```css
#main {
    display: -ms-grid;
	-ms-grid-columns: 300px auto 1fr 1fr; 
	-ms-grid-rows: 100px auto 1fr 100px; 
	width: 100%;
    height: 100%;
    margin: 0px;
}
```

In order to enable a grid layout within a div or region, set its `display` attribute equal to `-ms-grid`.
In this example, `#main` is a grid container with a 100% widgth and height and no margins so it takes up the entire window.

When setting up the grid, you also need to specify the rows and columns for the grid.
To create a grid that has 2 columns and 2 row, 
you would need to add `-ms-grid-columns: 1fr 1fr` and `-ms-grid-rows: 1fr` to the style of the grid.

In the above example, we have created a 4x4 grid.

The widths of the columns and height of the rows also need to be specified.
To create a fixed width or height, you can specify the it in pixels (px) or use auto to
indicate that the width fits to its content. You can also divide the remaining space into fractions using  the `fr` unit.

In the 2x1 example, each column is split to 1/2 of the width of the grid and there is one row.

In our 4x4 example, the first column has a fixed with of 300px, the second automatically
resizes to fit its content, and the last 2 take up 1/2 of the remaining space. 
Also, the first row is 100px, the second automatically sizes to its content, 
the third one takes up the remaining space, and the last row is 100px tall.

##### For a full page grid
```css
html, body {
	margin: 0px;
	height: 100%;
	width: 100%;
}
```

### Using the extension

To use our polyfill extension (replicate the grid behavior in non microsoft browsers) you must add the 'scalejs.layout-cssgrid' nuget package to your project. 

Inside our extension, we use a parser to parse grid-related css rules from the page. To improve performance and mitigate limitations of our parser, our extension only parses text between `/*GridLayoutStart*/` and `/*GridLayoutEnd*/` tags.

Since the extension parses the page's css to get all the css properties describing the grid, you will need to call a function to load the current page's styles into the extension. If you add/change the style elements in your header, you will need to recall this function to load the new styles into the extension.

##### Parse all styles from style elements in header (loads any hrefs)
```javascript
sandbox.layout.parseGridStyles(function () {
	console.log('styles loaded and parsed');
});
```

At any point after the styles are loaded, you will call `invalidate` to update the positions of elements on your page according to the grid. This function is called automatically when the window is resized.

##### Update elements to adhere to grid
```javascript
/*
 * add some elements to the page, they need to be placed according to grid rules
 */
sandbox.layout.invalidate(); 
```
You can pass a specific element to invalidate if you only want to recalculate the grid for that element+children 

##### Redalculating the children of a specific element
```javascript
sandbox.layout.invalidate({ container: myDiv });
```

Additionally, you can register a callback to respond to the layout being recalculated (including page resizing). Use the following functions.

##### A callback for whenever any part of the page is invalidated.
```javascript
sandbox.layout.onLayoutDone(function () {
	console.log("layout has been recalculated");
});
```

When you run your scalejs application, it will need to load/parse the styles at least once. Whenever your ScaleJS modules add templates to the page, you will have to consider whether the layout needs to be recalculated. If your template contains elements that will match to grid-layout css rules, you will need to call sandbox.layout.invalidate. Consider the following code snippet.

##### Calling invalidate from mainModule.js
```javascript
registerStates('root',
	state('app',
		state('initialization',
			onEntry(function () {
				parseGridStyles(function () {
					raise('goto.main', 0);
				});
			}),
			on('goto.main', goto('main'))),
		state('main',
			onEntry(function () {
				root(template('main_template', mainVM));

				invalidate();
			}))));
```

### Helper functions

Due to the behavior of Chrome/FF when dealing with invalid css, we must add -ms-grid styles to elements with special care. Since these tags are invalid css from the perspective of Chrome/FF, something like element.style[-ms-grid-row]: 1 will be ignored. Our solution is to add these style properties directly to the style attribute string, and retrieve them by parsing that string later. `sandbox.layout.utils.safeSetStyle(element, 'height', '100px')` will parse the style attribute, change or set height to 100px, then reset apply the style attribute without touching other properties your style may contain. `sandbox.layout.safeGetStyle` is exposed as well. 

For grid manipulation, `sandbox.layout.setTrackSize(element, track, size)` `sandbox.layout.getTrackSize(element, track)` `sandbox.layout.getComputedTrackSize(element, track)` are also exposed for setting/getting track sizes. `element` will be the element with `display: -ms-grid` on it. 

### Limitations/Differences

Our extension has a few limitations compared to the full -ms-grid spec. 
For auto-width columns, members should have a defined width (either inline style or css), 
otherwise they will extend to beyond their intended width. Additionally, grid elements 
that span multiple auto-sized rows or columns will result in incorrectly sized rows/columns.

As a result of our use of absolute positioning, our grids must explicitly state their width/height.
In IE, the following div would expand to a height of 300px, but using our extension in chrome/ff, the grid would 
default to height: 0px. If your grid needs a specific height, you must explicitly declare it.
```xml
<div style="display: -ms-grid; -ms-grid-rows: 100px 200px;"></div>
```

