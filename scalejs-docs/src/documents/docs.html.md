---
title: "Scalejs Docs"
isPage: true
---


# Scalejs Docs

<hr>

Scalejs has a bit of a learning curve. 
Reading the documentation isn't the best way to learn scalejs, but is here for you to gain a better understanding of scalejs.
Beginners may want to [look at our examples](https://github.com/lisovin/scalejs-examples) and check out our [learn-scalejs site](http://learn-scalejs.aws.af.cm/).
Another option for learning is to follow the [ToDoMVC tutorial](./todommvc.html).

It is also advised that new users try to learn JavaScript fundamentals, [Knockout.js](http://knockoutjs.com/), and [require.js](http://requirejs.org/).

### Creating a new Project

2 steps to creating a new project and running it. [See more](./project.html)

### Project Template

Scalejs has some boilerplate. Curious minds might wonder what each file does and its purpose in developing apps.
[See more](./template.html)

### Architecture

Application architecture is the core of scalejs. Everything else builds on top of these concepts:
loosely coupled, sandboxed modules built on top of a lean, extendable core, which exposes an abstracted API.
If you're not sure what any of that means, you can [Read more](./architecture.html).

### Model-View-ViewModel

An overview of MVVM concepts and also some samples of the MVVM api in scalejs. Good for beginners who are new to the concepts,
but also good for new scalejs users who understand MVVM but want to know about what it has to do with scalejs.
[Read more](./mvvm.html)

### Statechart

Arguably the most original aspect of scalejs, but also the hardest to understand. It is recomended that you read
this section, but also seek to understand statecharts more on your own by looking at examples and unit tests.
The statechart's purpose is to respond to events and modify the "state" of your app based upon these events.
The state consists of what modules are being shown on your UI at any given time, 
and application specific data (e.g. Username, etc) that also needs to be shared amongst modules. 
[Read more](./statechart.html).

### Routing

Routing controls the URL of your app, which allows you to directly link to different parts of the app.
Although not neccesary for many SPAs on mobile devices, this is mainly beneficial for web applications
which have different sections which would be good to share directly with others, or bookmark.
Also maintains history using the navigation, so one can use their browser's backspace button to go back in the app.
[Find out how to use it](./routing.html)


### UI Composition

Learning how to create regions in your UI and how to render views into those regions from modules across the whole
application is pretty important. So this is also a good document to read. [Read More](./composition.html)

### Grid Layout

Positioning modules in your layout using a grid which consists of rows and columns, in a simple way.
[Learn how to use it](./gridlayout.html).


### Grid

Learn how to create a filterable, sortable data grid which can support millions of rows.
[Read more](./grid1.html)


### Autocomplete

Learn how to use an extremely simplistic binding to create a robust and feature filled user input control. [Read More](./autocomplete.html)

### Visualization

This extention includes multiple types of visualizations to display complex data, that can be switch between and controlled dynamically. [Learn how to use it.](./visualization.html)