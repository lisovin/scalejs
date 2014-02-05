---
title: "Statechart"
isPage: true
styles: ["highlight.css"]
---

# Statechart and States

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

## Statechart implementation

The statechart is a __monad__ which in computer science is a functional programming structure which allows you to
define computations as a sequence of steps. It allows you to nest and chain operations together which creates
pipelines to process the data in steps, which each step having its own processing rules. This is a very convienient 
structure for building a statechart due to is clean and concise syntax.

### registerStates

The first step in the statechart building process is registering states onto the application state. 

__Example mainModule.js snippet__
```javascript
    var registerStates = sandbox.state.registerStates,
		state = sandbox.state.builder.state;
	
	// Add the "main" state as a child to the application state
	registerStates("app", state("main"))
```

`registerStates` takes at least one argument. It expects a `state()` builder to be passed into it.

Use this function when registering states from the module. Ensure loose coupling by having states add *themselves* to the "app" state.

### state

The second argument to `registerStates` should be a `state()` builder. Create hierarchical
structures by defining states as children or siblings of other states.

 __Example statechart__
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

 __Example statechart__
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


 __Example mainModule.js__
```javascript
	registerStates("app", "main");
```
__Example genericModule.js__

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

 __Example mainModule.js__
```javascript
	registerStates("app", "main");
```
__Example genericModule.js__

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

### onEntry

There has so far been one major thing missing from our discussion of states. We've told you
how to create states and nest states, but we haven't told you what you can *do* with states.

When a state is entered, typically the following can be done:

* Set application state properties to be accesible to all other states
* Update the module's ViewModel so that it shows the appropriate View for the state

This can be done by calling `onEntry` and passing a function.

__Example mainModule.js__
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

__Example mainModule.js__
```javascript
	var  // imports
		 registerStates = sandbox.state.registerStates,
		 state = sandbox.state.builder.state,
		 onEntry = sandbox.state.builder.onEntry;
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


