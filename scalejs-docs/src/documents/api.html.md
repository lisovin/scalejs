---
title: "ScaleJS API"
isPage: true
---
# Scalejs API

This Document contains all of the methods exposed by scalejs and most used extensions

<hr>

## application 

Coming soon!

## sandbox namespaces

### type

Method | Description
---|---|
`is` | __With 1 parameter__ will check that the value is neither null nor undefined. __With more then 1 parameter__, 'is' can be used to type-check a value and also be able to check if a nested property of an object exists or if it has a certain type.
`typeOf` | Takes any value and returns type e.g. "undefined", "null", "object", "number", "string" and "array".

### object

Method | Description
---|---|
`has` | Checks whether an object property is present and not null nor undefined. A chain of nested properties may be checked by providing more than two arguments.
`valueOrDefault` | When passed a value, it checks if the value (1st paramenter) is neither null nor undefined. If it exists, it returns the value (1st parameter) and if it does not, it returns the default Value (2nd parameter)
`merge` | Merges an object with the next object in the argument list, reducing all arguments into a single object. Objects provided later in the chain of arguments will overwrite existing properties.
`extend` | ??
`clone` | Makes a new copy of an object and all of its nested properties.
`get` | ??

### array

Method | Description
---|---|
`addOne` | ??
`removeOne` | ??
`removeAll` | ??
`copy` | Makes a new copy of an array
`find` | ??
`toArray` | ??

### debug

Method | Description
---|---|
`log` | same as console.log
`info` | same as console.info
`warn` | same as console.warn
`error` | same as console.error

### mvvm 

_*requires scalejs.mvvm_

Method | Description
---|---|
`observable` | same as ko.observable
`observableArray` | same as ko.observableArray
`computed` | same as ko.computed
`registerBindings` | can be used to register bindings _*Note: this has been depreciated. Use [plugins](./api.html#plugins) to register bindings._
`registerTemplates` | can be used to register templates. _*Note: this has been depreciated. Use [plugins](./api.html#plugins) to register bindings._
`toJson` | converts object to JSON notation
`toViewModel` | converts an object to a ViewModel (creates observable properties for each property)
`toObject` | converts a ViewModel to an object
`dataClass` | ??
`template` | ??
`dataBinding` | ??
`selectableArray` | ??
`root` | ??

### state

_*requires scalejs.statechart-scion_

Method | Description | 
---|---|
`registerStates` | Registers states onto parent state. First argument is the parent state id. Additional arguments are state builder functions. _[Read More](./statechart.html#registerstates)_
`registerTransition` | ??
`unregisterStates` | ??
`raise` | Raises an event on the statechart. First argument is the event name. A second argument may be provided to pass data associated with the event. _[Read More](./statechart.html#raise)_
`observe` | ??
`onState` | ??
`builder.builder` | ??
`builder.state` | State builder function. First argument is the state id. Additional arguments can be either state builders or transition builders. _[Read More](./statechart.html#state)_
`builder.parallel` | Same as state builder, except it creates a parallel state. _[Read More](./statechart.html#parallel)_
`builder.initial` | ??
`builder.onEntry` | On Entry transition builder. Takes a single argument (a function) which will be evaluated whenever the state it is defined on is entered. _[Read More](./statechart.html#onentry)_
`builder.onExit` | Same as onEntry, except it runs when the state is exitted. _[Read More](./statechart.html#onexit)_
`builder.on` | An event transition builer. There are two necessary arguments: The first argument should be the event name (string) and the last argument should be a `goto` function. There can be an optional second argument which should return true if the goto function should run, or return false to cancel the transition. _[Read More](./statechart.html#on)_
`builder.whenInStates` | ??
`builder.whenNotInStates` | ??
`builder.goto` | First argument is the state id of the desired destination state. An additional argument may be past which gets evaluated when the transition occurs. _[Read More](./statechart.html#goto)_
`builder.gotoInternally` | Same as goto, except it does not re-enter parent states when entering children states. _[Read More](./statechart.html#gotointernally)_
`builder.statechart` | Can be used to create a new statechart. 


