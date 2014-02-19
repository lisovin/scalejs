---
title: "Routing"
isPage: true
---

# Routing

<hr>

To enable routing:

1. Make your _main_ state the child of the _router_ state (using `routerState` to register the state instead of `state`)
2. Make sure any routable state is has the _main_ state as its ancestor
3. Make a state routable by passing it the `route()` builder with the name of the url hook you would like it to use (e.g. http:\\web.url\?home would be registed as `route('home')`
4. Make a "default" route state by passing it `route('\')`
