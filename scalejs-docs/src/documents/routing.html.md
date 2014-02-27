---
title: "Routing"
isPage: true
---

# Routing

<hr>
Routing is an essential aspect of any Single Page Application, but it is not always the easiest thing to implement.
This is why statechart-integrated routing makes it very convienient to code your app without routing in mind, and drop it in
when you feel like you need it.

Routing allows you to give states their own URL so that users of you app can bookmark or link others to these states.
This gives the appearance of having distinct pages for certain states, without the need to retrieve a new page from the server.

<br>

## routerState

To enable routing in your app, you need to specify which state will be your router state.
The router state is an ancestor to all routable states. This could be your `main` or `app` state for example.

After deciding on which state will be the router state, simply change the `state()` builder to
`routerState()` builder.

##### Example: Declaring the routerState of your app
```javascript
var routerState = sandbox.routing.routerState;

registerStates('root', routerState('app'));
```

<br>

### baseUrl

There are situations where the root of your app is not in the root of your domain. (e.g. http://yourapp.com)
For example, if you are building a marketplace app, you might place the app in a directory called '_store_' (e.g. http://yourapp.com/store)
In this situation, the second parameter of the `routerState` function needs to be an options object specifying the baseUrl.

##### Example: Specifying a baseUrl for your app.
```javascript
var routerState = sandbox.routing.routerState;

registerStates('root', routerState('app', { baseUrl: 'store' }));
```

<br>

## route

To make a specific state routable, you must pass the `route()` builder function to the `state()` builder.
There are many ways to specify a route for a state. Remember that the state which recieves the `route()`
builder must be a descendant of a state created using the `routerState()` builder.

<br>

### Root

When you open your application without a URL, the router needs to know which state should be shown.
This is known as the __root__ of you application. The to make a state the root, you need to pass `router('/')` to the `state()` builder.

##### Example: Declaring the root state
```javascript
var routerState = sandbox.routing.routerState,
	route = sandbox.routing.route;

registerStates('root', routerState('app',
	state('a', route('/'))));
```

<br>

### A Static Route URL

There are many different ways to specify a route.
The most simple way to do this is to specify a static name for the route.
An example of a URL created with a static name would be http://yourapp.com/?b.

##### Example: Creating a static route
```javascript
var routerState = sandbox.routing.routerState,
	route = sandbox.routing.route;

registerStates('root', routerState('app',
	state('a', route('/')),
	state('b', route('b'))));
```

<br>

### A Dynamic Route URL

In some situations, you would like to pass some data to the routed state depending on the URL.
An example of this would be a state that expects an `id` to be specifed when it is entered.
In this situation, if the id is 1, the url would be http://yourapp.com/?b/1, but if the
id is 2, then the url would be http://yourapp.com/?b/2.

In this situation, you need to specify in the `route()` string as before, except with an aditional `'/{id}'`
at the end so that the router knows to expect a value after `'b/'` that will be a part of the event data.

##### Example: Creating a dynamic route
```javascript
var routerState = sandbox.routing.routerState,
	route = sandbox.routing.route;

registerStates('root', routerState('app',
	state('a', route('/')),
	state('b', 
		route('b/{id}'),
		onEntry(function(e) {
			console.log(e.data.id);
		}))));
```

If internally you are navigating to this state, you must pass the value when you call `raise()` or else the `id` in your URL will be undefined.

##### Example: Navigating to a dynamic route using raise
```javascript
var routerState = sandbox.routing.routerState,
	route = sandbox.routing.route;

registerStates('root', routerState('app',
	state('a', 
		route('/'),
		on('b.open', goto('b'))),
	state('b', 
		route('b/{id}'),
		onEntry(function(e) {
			console.log(e.data.id);
		}))));

raise('b.open', { id: 1 });
```

If you use the URL http://yourapp.com/?b/1 to navigate to your app, the event data will automatically contain the id.

Dynamic routes can go as many levels deep as you need. For example, if you would like to pass additional data
when routing to your app, you can specify the url as http://yourapp.com/?b/1/2.

##### Example: Creating a dynamic route with more than 1 parameter
```javascript
var routerState = sandbox.routing.routerState,
	route = sandbox.routing.route;

registerStates('root', routerState('app',
	state('a', route('/')),
	state('b', 
		route('b/{x}/{y}'),
		onEntry(function(e) {
			console.log(e.data.x); //1
			console.log(e.data.y); //2 
		}))));
```

<br>

### A route URL with paremeters

In addition to the syntax http://yourapp.com/?b/{id}, you can also specify the parameter in the following manner:
http://yourapp.com/?b?id={id}.

##### Example: Creating a route that expects a named parameter
```javascript
var routerState = sandbox.routing.routerState,
	route = sandbox.routing.route;

registerStates('root', routerState('app',
	state('a', route('/')),
	state('b', 
		route('b?x={x}'),
		onEntry(function(e) {
			console.log(e.data.x);
		}))));
```

Like the dynamic route path, you can specify as many parameters as you would like.

##### Example: Creating a route that expects a more than 1 named parameter
```javascript
var routerState = sandbox.routing.routerState,
	route = sandbox.routing.route;

registerStates('root', routerState('app',
	state('a', route('/')),
	state('b', 
		route('b?x={x}&y={y}'),
		onEntry(function(e) {
			console.log(e.data.x);
			console.log(e.data.y);
		}))));
```

You can also combine dynamic paths and parameters to create complex URLs

##### Example: Creating a dynamic route that expects parameters
```javascript
var routerState = sandbox.routing.routerState,
	route = sandbox.routing.route;

registerStates('root', routerState('app',
	state('a', route('/')),
	state('b', 
		route('b/{x}?y={y}'),
		onEntry(function(e) {
			console.log(e.data.x);
			console.log(e.data.y);
		}))));
```

Dynamic routes and parameterized routes both have their own use cases. 
The former is useful for clean urls.
The latter is useful for making it clear exactly which properties will be expecting values.

<br>

## Routing Expectations

There is one routing expectation which must be known as it is non-obvious but makes sense once it is explained.
Due to the nature of routing's implementation, you may easily make the mistake of giving a descendant of a routed state
a route itself.

##### Example: Incorrect usage of routing
```javascript
var routerState = sandbox.routing.routerState,
	route = sandbox.routing.route;

registerStates('root', routerState('app'
	state('main',
		route('/'),
		state('a'),
		state('b', route('b')))));
```

In this situation, you might expect the root to be routed to state __a__
and when the url for state __b__ is entered, to be routed to state __b__.

In this case, it is entirely unclear which state is _actually_ the root state, since both state __a__ and __b__ are children
of the state routed to root.

In order to fix this, if need to explicitly define which child state of 'main' is the root. 

##### Example: Correct usage of routing
```javascript
var routerState = sandbox.routing.routerState,
	route = sandbox.routing.route;

registerStates('root', routerState('app'
	state('main',
		state('a', route('/')),
		state('b', route('b')))));
```

<br>

## Summary

* Routing is easily implemented due to it being integrated with the statechart
* Routed states must be descendants of the `routerState()`
* Routed states must be passed the `route()` builder
* The root of your app must be specified with `route('/')`
* Dynamic and parameterized routes can be specified so states can recieve data
* Routed states must not be descendants of a routed state due to ambiguity