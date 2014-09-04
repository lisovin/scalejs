---
title: "ScaleJS Install"
isPage: true
---

# Install Scalejs

<hr>

## Prerequisites
1. Visual Studio 2012 or 2013 (Express editions not supported)
2. [IIS Express](http://www.iis.net/learn/extensions/introduction-to-iis-express/iis-express-overview) (via Web Platform Installer)
3. node.js (http://nodejs.org/)
4. requirejs optimizer (once node.js is installed run in console: npm install -g requirejs)
5. PowerShell 3.0 (http://www.microsoft.com/en-us/download/details.aspx?id=34595)
6. If using the LESS template, run in console: npm install -g less
7. If using the LESS template, add `<mimeMap fileExtension=".less" mimeType="text/less" />` to applicationhost.config in your User folder under **Documents/IISExpress/config/** directory

## Install
In Visual Studio go to TOOLS -> Extensions and Updates... -> Visual Studio Gallery and type `Scalejs` in the search box. It will filter the list of extensions to have just `Scalejs`. Click `Download` button - this will install the extension.
After installation you'll have 3 project templates (Scalejs MMVM Application (CSS), Scalejs MMVM Application (LESS), and Scalejs Extension)  and 2 item template (Scalejs MVVM Module (CSS) and Scalejs MVVM Module (LESS))