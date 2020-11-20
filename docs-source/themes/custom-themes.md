It is possible to integrate the TypeDoc Pages Plugin with your own custom themes by making a few changes to your theme:

The main page are displayed using the template `markdown-page.hbs`

Here is the default content 

```
<div class="tsd-panel tsd-typography">
    {{#markdown}}{{{model.pagesPlugin.item.contents}}}{{/markdown}}
</div>
```