# Scalejs

<hr>

<h3>Scalejs is a robust JavaScript framwework for creating web and mobile appications.
It is designed for .NET developers or those who come from a WPF os Silverlight background.
It is the _only_ JavaScript framework which is optimized to run in Visual Studio and
allows you to program using the software patterns you know and love.</h3>

<hr>

## Scalable Architecture

Scalejs is designed on top of a scalable architecture: a lean extendable core and sandboxed, loosely-couples modules.
The core is tiny and only exposes some functions. You can register extensions on the core and on the
sandbox. The sandbox allows modules to play safely and not interfere with eachother. 

## Project Templates

Jump-start your development process using our Project Templates which do the work of setting up the project for you.
It comes with a configurable app with some of the most common extensions (MVVM, Statechart, Styles, LINQ) and a
module ready for you to use. It has development, debug, and release modes, as well as a testing framework. 
You'll also recieve templates needed to create Extensions and new Item Templates for creating modules.

## Modular

Modules are independent components of your application that do not depend on other modules.
They are organized into their own directories under your app and contain all of the files it needs.
They have access to their own copy of the sandbox, so that they cannot interfere with eachother
even if they wanted to.

## Extendable

The core and sandbox can be extended so that modules have access too all kinds of feeatures. 
This allows you to swap out extensions as needed without changing your application code
as long as the API is kept consistant. Your app doesn't need to rely on base libraries
which are subject to change over time.

## NuGet Package Management

Extensions can be managed through NuGet. You can create and publish your own Extensions on NuGet as well.
When Nuget installs or uninstalls an extension, it modifies the configuration of your app automatically.
It's a one-click install procress which gives you everything you need.

## Intellisense

The sandbox and core have intellisense so that as you code using those functions, you can easily
see what they are. You can also get intellisense on the files in your modules, such as the ViewModels.
This feature is lacking on most JavaScript projects today, but it's a given in the .NET universe, 
so you can expect to see it being leveraged here.

## Model-View-ViewModel

MVVM is one of the extensions that are provided in the project template. It enforces seperation of concerns
with the very common MV* software patterns. Bindings make it really easy to write complex, data-driven UIs.
Two-way data-binding with observables frees you up from worrying how you will update the DOM.

## Statechart

The state chart makes it easy to declare and manage the state of your app with the flow of events.
Similar to a typical state machine except it also allows for parrallel and hieracical states,
allowing for even more complex and intricate states, while also using a clean, concise, and organized
declaration method using computation expressions.

## Routing

State-integrated Routing allows the easy creation of routing in your app. Build your app without
routing in mind and add routing as you see necessary. Once a route is applied to a state,
it updates the URL whenever it is entered and will route the app too that state if the url is entered.

## Reactive

You can easily create observable events and listen and react to these events. The reactive pattern
is needed for creating loosely coupled modules and is what the MVVM, statechart, and routing 
extensions are built on top of.

## Organized Stylesheets

Use CSS or LESS and prevent your styles from becoming a mess by including them within the module.
A module worries about its own styles so you can code smarter and cleaner. 
Follow good stylesheet patterns easily using a CSS Linter.

## Layout

Layout your modules using the main module while still preserving the loosely coupled pattern.
Use the css-grid extesion to create powerful and complex layouts easily!

## Linq

Use linq's clean and concise syntax to work with collections. 

## Data-Driven

Whether you're using Ajax or WebSockets, Scalejs has the extension for you.
Currently we have extensions for SignlarR and Breeze.

## UI Components

Grids, Treemaps, Autocompletes, Tiles, Panoramas, Transitions, and Other Visualizations.

## Build and Deployment

Build for Development, Debug, and Release easily. Create packages for all mobile devices:
iOs, Android, and Windows 8.

## Mobile

Phones and Tablets; iOs, Android, or Windows 8. Code once, deply anywhere.

## Testable

Uses the Jasmine testing framework to make sure your applications work.