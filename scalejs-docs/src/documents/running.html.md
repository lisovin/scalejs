---
title: "Running your App"
isPage: true
---


# Running Your App

Once you have everything installed, and a simple test created, running your Scalejs application is easy. There are 2 main ways to run an application:

* Development Mode - This mode lets you quickly make changes and view them in your browser for rapid development.

* Built Application - This lets you view and test the site fully built and in the deployed state

## Development Mode

To run your app in development mode, simply press ```Ctrl + F5``` in visual studio to launch IIS Express configured already to host your site. By default, you can now reach your site at the url ```localhost:8888``` (Remember to disable caching for development). This port can be changed in the applicatin host config file in the IIS folder (by default in 'My Documents' on windows). With IIS running, simple saving a change to a file and refreshing the browser will load your changed files.

![See your Application in your browser](./helloworld.png)

## Built Application

To run in 'built' mode, first, launch IIS as stated above. Then, select 'debug' or 'release' in visual studio, then build your solution (```Ctrl + Shift + B```). Building in release will make an unminified .js file containing your entire project, and release will do the same, but minified. Then, navigate to ```localhost:8888/index.debug.html``` or ```localhost:8888/index.release.html```, respectively, to see your project running in it's final built state.

## Embedding your application

Scalejs supports embedding your applicaton in a larger site with almost no effort. A ```script``` tag containing your app's javascript file by default is inserted into the head of an empty document, so your app uses the entire page. However, simple putting this ```script``` tag into an existing page, will render the scalejs app you built in the location of the script tag on the DOM.