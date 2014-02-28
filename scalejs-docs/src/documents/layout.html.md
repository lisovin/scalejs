---
title: "Layout"
isPage: true
---

# Grid Layout

<hr>

One of the most frustrating aspects of developing in HTML5 is creating the layout of your app.
Due to the nature of CSS, conceptually simple layouts are hard, and complex layouts are near impossible.
We decided to adopt the [CSS Grid Layout Module](http://www.w3.org/TR/css-grid-1/) pattern by
creating a polyfill of [Microsoft's Grid Layout](http://msdn.microsoft.com/en-us/library/ie/hh673533(v=vs.85).aspx).
Although the polyfill can be used as a stand-alone script for basic HTML5 applications, here we will
explain hot to use the CSS Grid Layout in your own scalejs app.

Install the __scalejs.layout-cssgrid__ extension with NuGet to import the __layout__ namespace.

<br>

## CSS that makes sense

Use CSS to create grids without the frustration of using CSS - the grid layout is very easy to grasp,
and does not take guess-work to position things correctly. 

If you developed for IE then you may already know how to use the -ms-grid styles attribute.
There are some things that our grid cannot do, such as alignment.

(Fullscreen without code, fullscreen with code) (other fullscreen with code is for ui composition)

### HTML

After [composing your UI] to contain all of the regions it needs, you can easily define where they are positioned
by applying some styles to them. 

The [CSSGridLayout](

### main
