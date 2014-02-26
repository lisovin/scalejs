---
title: "Statechart"
isPage: true
styles: ["highlight.css"]
---

# Statechart

<hr>

Every interface has certain states which determine what is currently displayed on the UI. 
Originally state was managed indirectly with the [reactive](./reactive.html) pattern by publishing events and
notifying subscribers. For instance, when a user logs in, modules which needed to show
user-related information would need to respond to this event and change their view. At the same time,
the layout needed to respond to this change to hide/show modules as neccessary. 

It was soon found that without the concept of "state" this process became cumbersome to maintain.
This is why the scalejs devs decided to incorporate [Harel Statecharts](http://www.w3.org/TR/scxml/)
to manage state. The way Statecharts differ from typical state machines is that they allow
for more complex states which is suited for User Interface design. The main differences is that
it allows you to create hierarchical states and parallel states. This will be elaborated on further below.

The statechart is one of the most original aspects of scalejs. Of course, the statechart isn't
part of the scalejs core, but it is already included for your convience in the [project template](./project.html).
It can be found in the __scalejs.statechart-scion__ extension. This extension adapts [scion statecharts](https://github.com/jbeard4/SCION)
so that they can be defined using builder functions.

<br>

## Statechart Builder

The statechart is created using builder functions which allow you to define states, transitions, and other
statechart-related properties. These builder functions are defined in the __state.builder__ namespace
and can be nested so that complex hierarchical structures can be created.  The statechart builder
runs and creates the statechart before your application starts. The statechart cannot be altered
after the app runs. Therefore, the statechart is a deterministic function that for any given input
has a predictable output. This makes creating states very easy, clean, and concise.

<br>

## registerStates

The first step in the statechart building process is registering states onto the application state. 

##### Example: adding the "main" state to "app" state
```javascript
    var registerStates = sandbox.state.registerStates,
		state = sandbox.state.builder.state;
	
	// Add the "main" state as a child to the application state
	registerStates("app", state("main"))
```

`registerStates` takes at least one argument. It expects a `state()` builder to be passed into it.

Use this function when registering states from the module. Ensure loose coupling by having states add *themselves* to the "app" state.

<br>

## state

The second argument to `registerStates` should be a `state()` builder. Create hierarchical
structures by defining states as children or siblings of other states.

##### Example: creating a hierarchical statechart
```javascript
    var registerStates = sandbox.state.registerStates,
		 state = sandbox.state.builder.state;
	
	// hierarchical structure with 3 levels

	registerStates("app",				//app state will be parent state
		state("A",								// State A - First Level State with 2 children
			state("A.1"),								//State A.1 & A.2 - Second level sibling states
			state("A.2")),
		state("B",								// State B - Another First Level State with 3 children and 1 grandchild
			state("B.1"),							// State B.1, B.2, & B.3 - Second level sibling states
			state("B.2"),
			state("B.3",							// State B.3 - 2 children states
				state("B.3.a"),						//State B.3.1 & State B.3.b - Third level sibling states
				state("B.3.b"s))),
		state("c"));
```

You can create infinitely long statecharts, or create and organized structure with abstracted code

##### Example: abstracting states into functions
```javascript

	function stateA() {
		return state("A",								
			state("A.1"), state("A.2"));
	}

	function stateB() {
		return state("B",								
			state("B.1"),							
			state("B.2"),
			state("B.3",							
				state("B.3.a"),						
				state("B.3.b"))));
	}


	registerStates("app",			
		stateA(), stateB(), state("c");
```

Statecharts are prebuilt before the application runs. This allows modules to set up their states
in advance. Assume modules to be loaded dynamically because they are independent of one another.
This means you cannot have control over the _order_ of the states being registered parent state.


##### Example: registering states from 2 different modules on the same parent state
_mainModule.js_
```javascript
	registerStates("app", "main");
```
_genericModule.js_

```javascript
	registerStates("app", "generic");
```

In these snippits of code note that:

* They are evaluated in the module js file, which means they are added to the state when the module is created (before the app runs)
* Modules which are independent of other modules can load asynchonously 
* Therefore when the application starts it will be either enter the "main" state or the "generic" state
* This is because when a normal state defines children, these children are mutually exclusive and the first child state is automatically entered.
* The state of the application is always a "leaf" state - it must have NO children

In order to preserve order, you can define a state in a module which is a child of a state created in another module

##### Example: registering a state from one module as a child to the state of another module
_mainModule.js_
```javascript
	registerStates("app", "main");
```
_genericModule.js_

```javascript
	registerStates("main", "generic");
```

This brings us to some statechart "rules"

* The application state must always be a __childless state__
* The application state always a parent state before it enters the child state
* The application always exits a child state before it exits the parent state
* The statechart is built before the application runs and _after_ all modules have been created.

This means it doesn't matter if the "genericModule" is created before the "mainModule" - the statechart is smart enough to know to build the statechart in the correct order!

But making a state a child state is not the only way to preserve order. In fact, it is far from the recommended way.
Let's postulate that there is no "mainModule" at all. This would cause the statechart build step to fail, because there is no "main" state defined but
"generic" is defined as a child for the "main" state. In order to ensure that order and loose coupling are enforced, it is best to have
a base state and have modules define themselves on that state. That way you do not have a huge chain of depencies with your modules.

This leads to the problem we saw in the previous code snippet in which the first state which is defined is the state which is entered.
In order to create a predictable flow and order of your statechart, you can use _events_ and _transitions_ to hop from state to state!

<br>

## onEntry

There has so far been one major thing missing from our discussion of states. We've told you
how to create states and nest states, but we haven't told you what you can *do* with states.

When a state is entered, typically the following can be done:

* Set application state properties to be accesible to all other states
* Update the module's ViewModel so that it shows the appropriate View for the state

This can be done by calling `onEntry` and passing a function.

##### Example: defing an onEntry transition
```javascript
	var registerStates = sandbox.state.registerStates,
		 state = sandbox.state.builder.state,
		 onEntry = sandbox.state.builder.onEntry;

	registerStates("app",
		state("main",
			onEntry(function() {
				// do stuff here!
				sandbox.debug.log("onEntry of main state called");
			})));
```

When you enter a state, you can set a property of your viewModel to be a property of your state.

##### Example: creating a property on the statechart
```javascript
	var  // imports
		 registerStates = sandbox.state.registerStates,
		 state = sandbox.state.builder.state,
		 onEntry = sandbox.state.builder.onEntry,
		 // viewModel
		 viewModel = mainViewModel();

	registerStates("app",
		state("main",
			onEntry(function() {
				// you can set state properties by adding them to "this"
				
				this.region = viewModel.region;
			})));
```

In this example, the mainViewModel defines a "region" property. This is a property of the state
because it is being used to define a region in the template which can be used to render templates
from other modules. In order for other modules to have access to this property, it must be made
part of the state. 

We go more in depth about regions and how to use them in the statechart in the [layout](.layout.html) section.

In the following example, you can see how easy it is to update the viewModel from the statechart.
This gives you control over what is displayed in the view when in certain states.

##### Example: updating a viewModel property from the state
```javascript
	var  // imports
		 registerStates = sandbox.state.registerStates,
		 state = sandbox.state.builder.state,
		 onEntry = sandbox.state.builder.onEntry,
		 // viewModel
		 viewModel = mainViewModel();

	registerStates("app",
		state("main",
			onEntry(function() {
				// when entering a state, you can choose to update the viewModel to reflect that state
				
				viewModel.entered(true);
			})));
```

You can also modify state properties when the state is entered as well.
Because of this, the properties of your viewModels and statechart can be strictly controlled by what you do when states are entered.

<br>

## onExit

onExit is pretty much the same as onEntry, except it runs after a state is exitted.
You can use this to remove any changes to the statechart and viewModel that were done in onEntry,
so that states only need to worry about how to display themselves!

For example, if you want to hide the mainModule when you enter/exit the main application, you might do something like this:

##### Example: using onExit to undo changes made by onEntry
```javascript
	var  // imports
		 registerStates = sandbox.state.registerStates,
		 state = sandbox.state.builder.state,
		 onEntry = sandbox.state.builder.onEntry,
		 onExit = sandbox.state.builder.onExit,
		 // viewModel
		 viewModel = mainViewModel();

	registerStates("app",
		state("main",
			onEntry(function() {
				// when entering a state, you can choose to update the viewModel to reflect that state
				viewModel.entered(true);
			}),
			onExit(function() {
				// when exiting a state, you can update the viewModel so it no londer indicates that it is in this state
				viewModel.entered(false);
			}));
```

For this to toggle the visibility on the main module, you can bind the `entered` property to a visible binding.
_*Note: more programming is required to actually render the templates for the main module, which is elaborated on in [layout](./layout.html)_

[To be continued: Using arguments passed on onEntry and onExit)

<br>

## on

The next step in building the statechart is telling the statechart how to transition from state to state.
To specify a transition on a state, you can pass the `on` function to a state. `on` takes up to 3 parameters.
There are two required arguments: the first argument is a string which specified the event hook (created with `raise`).
The second (optional) argument can be a function which allows this transition to be conditional (e.g. if the function returns
true then the transition runs, if not it does not run). The last argument is a `goto` builder which
specifies the destination state. 

##### Example: defining a transition
```javascript
	var  // imports
		 registerStates = sandbox.state.registerStates,
		 state = sandbox.state.builder.state,
		 on = sandbox.state.builder.on,
		 goto = sandbox.state.builder.goto;

	registerStates("app",
		state("main",
			state("main.loading"),
			state("main.loaded"),
			on("main.loaded.completed", goto("main.loaded"))));
```

When `on` is defined on a state, that event is only triggered if the application is in the state.
This allows you to ensure transitions are run when you are in the correct state. If the application
is not in the `main` state and `main.loaded.completed` event is raised, the transition will
not occur. This solves many application development headaches by simplifying the logic needed
to determine the flow of the application.

Transions can also be conditional.

##### Example: defining a transition
```javascript
	var  // imports
		 registerStates = sandbox.state.registerStates,
		 state = sandbox.state.builder.state,
		 on = sandbox.state.builder.on,
		 goto = sandbox.state.builder.goto;

	registerStates("app",
		state("main",
			state("main.loading"),
			state("main.loaded"),
			state("main.error"),
			on("main.loaded.completed", function(data) {
				return data.success;
			}, goto("main.loaded")),
			on("main.loaded.completed", function(data) {
				return !data.success;
			}, goto("main.error"))));
```

In this example, when `raise` is called it is also passed some data. This data
is provided to the transition so that it can be processed. For example,
in the "loading" state, the data may load but it might be successful or unsuccessful.
Passing additional data when the `main.loaded.completed` event is raised allows
you to react to the data being passed and prevent the evaluation of the transition if neccesary by
having it return a falsey value, or continue the evaluation of the transition by returning a true value.

Using events and transitions allow you to jump from state to state. In order to activate these transitions,
your application needs to raise events so that the statechart can respond.

<br>

## raise

`raise` is pretty straightforward: it creates an event that your statechart listens for. 
If a transition is defined for the event in the current state that it's in, then the transition runs.

##### Example: using raise to create an event
```javascript
	var  // imports
		 registerStates = sandbox.state.registerStates,
		 state = sandbox.state.builder.state,
		 onEntry = sandboxstate.builder.onEntry,
		 on = sandbox.state.builder.on,
		 goto = sandbox.state.builder.goto
		 raise = sandbox.state.raise,
		 // viewmodel
		 viewModel = mainViewModel();

	registerStates("app",
		state("main",
			state("main.loading",
				onEntry(function() {
					viewModel.load(function () {
						raise("main.loaded.completed")
					});
				})),
			state("main.loaded"),
			on("main.loaded.completed", goto("main.loaded"))));
```

In this example, when the `main.loading` state is entered, it calls a function
defined in the viewModel called `load`. It passes to `load` a callback
that will raise the `main.loaded.completed` after load completes. Since the application
enters the `main` state, the transition defined on this state is evaluated as it matches
the event. This will transition the application from the `main.loading` state to the `main.loaded`
state.

`raise` can also be called with some additional data which can allow you to create conditional transitions.

##### Example: using raise to create an event with additional data
```javascript
	var  // imports
		 registerStates = sandbox.state.registerStates,
		 state = sandbox.state.builder.state,
		 onEntry = sandboxstate.builder.onEntry,
		 on = sandbox.state.builder.on,
		 goto = sandbox.state.builder.goto
		 raise = sandbox.state.raise,
		 // viewmodel
		 viewModel = mainViewModel();

	registerStates("app",
		state("main",
			state("main.loading",
				onEntry(function() {
					viewModel.load(function (success) {
						raise("main.loaded.completed", { success: success })
					});
				})),
			state("main.loaded"),			
			state("main.error"),
			on("main.loaded.completed", function(data) {
				return data.success;
			}, goto("main.loaded")),
			on("main.loaded.completed", function(data) {
				return !data.success;
			}, goto("main.error"))));
```

In this example, the the viewModel fails to load, it can transition to the `main.error` state
as opposed to the `main.loaded` state.

<br>

## goto

So far you've seen how to create transitions using `on`. One of the required parameters of `on`
is a `goto` builder. `goto` requires a state id. If the transition runs, the application
leaves the current state and enters the new state.

`goto` is implemented in such a way that if you were to try to use it to transition to a child state,
it exits and re-enters the current state.

<br>

## gotoInternally

Almost exactly the same as goto, except it can transition from a parent state to a child state without
first having to re-enter the state it is in. It transitions the app directly to the child state.

This is used almost as often as `goto` so knowing the difference is important.

<br>

## parallel

`parallel` is similar to `state` but instead of expecting mutually exclusive child states,
it allows all of its children states to run in parallel to eachother. 

Parallel states can be very useful when implementing authentication. When a user logs in,
how does the application react? What visual aspects change? This can be managed by having two
parallel states defined on main like so:

##### Example: defining parallel states
```javascript
	var registerStates = sandbox.state.registerStates,
		parallel = sandbox.state.builder.parallel,
		state = sandbox.state.builder.state;

	registerStates('root', parallel('app',
		state('authentication'),
		state('main')));
```

In this example, the app now has two parallel states: an authentication state and the main state which 
controls the UI/Layout. These states themselves can have mutually exclusive children:

##### Example: a benefit of parallel states - convienience
```javascript
	var registerStates = sandbox.state.registerStates,
		parallel = sandbox.state.builder.parallel,
		state = sandbox.state.builder.state;

	registerStates('root', parallel('app',
		state('authentication',
			state('logged.in'),
			state('logged.out')),
		state('layout',
			state('dashboard'),
			state('main'))));
```

This means your app is in both a child state of "authentication" and "layout" throughout its lifecycle.
You can easily go from logged in to logged out with minimal amount of code. 