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
==========
1. Visual Studio 2012 or 2013
2. [IIS Express](http://www.iis.net/learn/extensions/introduction-to-iis-express/iis-express-overview) (via Web Platform Installer)
3. node.js (http://nodejs.org/)
4. requirejs optimizer (once node.js is installed run in console: npm install -g requirejs)
5. PowerShell 3.0 (http://www.microsoft.com/en-us/download/details.aspx?id=34595)
6. If using the LESS template, run in console: npm install -g less
7. If using the LESS template, add `<mimeMap fileExtension=".less" mimeType="text/less" />` to applicationhost.config

Install
========
In Visual Studio go to TOOLS -> Extensions and Updates... -> Visual Studio Gallery and type `Scalejs` in the search box. It will filter the list of extensions to have just `Scalejs`. Click `Download` button - this will install the extension.
After installation you'll have 3 project templates (Scalejs MMVM Application (CSS), Scalejs MMVM Application (LESS), and Scalejs Extension)  and 2 item template (Scalejs MVVM Module (CSS) and Scalejs MVVM Module (LESS))

Tutorials
=========
1. [Quick Start](https://github.com/lisovin/scalejs/wiki/Quick-Start)
2. [TodoMVC](http://lisovin.github.io/scalejs/scalejs-docs/out/todomvc)

Examples
========
1. [Highstock](https://github.com/lisovin/scalejs-examples/tree/master/Highstock) - an appplication that retrieves stock data from the server and renders it as an interactive chart. 

License
=======
MIT license: http://opensource.org/licenses/mit-license.php
