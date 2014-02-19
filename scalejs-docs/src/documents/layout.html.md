---
title: "Layout"
isPage: true
---

<div class="popout h-white bg-crimson">
<h1>Layout</h1>
</div>

As we developed more applications with scalejs, we developed a solid way to manage the layout
without closely-coupling modules together. Using a combination of the mvvm and statechart
extension allows you to create regions for modules to render themselves without having
any modules "know" about other modules. It enforces loose-coupling and therefore is the
recommended approach to doing your layout. 

For more advanced layouts, there is also __scalejs.layout-cssgrid__

