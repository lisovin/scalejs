scalejs
=======

Develop scalable JavaScript client side applications in Visual Studio.

The framework is targeted towards a .Net developer who has experience with Silverlight or WPF 
and is looking for ways to apply same principles and patterns 
(e.g. MVVM, bindings, modularization, templated controls, reactive programming, etc.)
to JavaScript client side development. 

It's inspired by Nicholas Zakas <a href="http://www.youtube.com/watch?v=vXjVFPosQHw">"Scalable JavaScript Application Architecture"</a> talk. 
The framework leverages best tools and libraries such as Knockout, Linq, RxJS, RequireJS, JSLint, SCION statecharts engine, Chutzpah, jasmine, etc. and relies on what's considered as "good parts" of JavaScript language.

Prerequisites
=============
1. Visual Studio 2012
2. IIS Express (via Web Platform Installer)
3. node.js (http://nodejs.org/)
4. requirejs optimizer (once node.js is installed run in console: npm install -g requirejs)
5. PowerShell 3.0 (http://www.microsoft.com/en-us/download/details.aspx?id=34595)
6. JSLint.VS2012 extension for Visual Studio (in Visual Studio go to TOOLS -> Extensions and Updates... -> Visual Studio Gallery and type `JSLint` in search box)
7. Chutzpah Test Adapter for Visual Studio 2012 (in Visual Studio go to TOOLS -> Extensions and Updates... -> Visual Studio Gallery and type `Chutzpah` in search box)

Installation
============
In Visual Studio go to TOOLS -> Extensions and Updates... -> Visual Studio Gallery and type `Scalejs` in the search box. It will filter the list of extensions to have just `Scalejs`. Click `Download` button - this will install the extension.
After installation you'll have 3 project templates (Scalejs Application, Scalejs Extension, and Scalejs Test)  and 1 item template (Scalejs Module)
See tutorial below for how to use them. 

Tutorials
=========
1. [Quick Start](https://github.com/lisovin/scalejs/wiki/Quick-Start)

Examples
========
1. [Highstock](https://github.com/lisovin/scalejs-examples/tree/master/Highstock) - an appplication that retrieves stock data from the server and renders it as an interactive chart. 

License
=======
MIT license: http://opensource.org/licenses/mit-license.php
