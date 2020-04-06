You can create links to your code inside your pages the same way you would in your TypeDoc code comments, with symbol links, by leveraging either of the below syntaxes:

**Square Brackets Symbol Links**

```handlebars
See [[ClassName.propertyName]] for more information.
```

[[PluginOptions.groups]]

**@link Symbol Links**

```
See {@link ClassName.propertyName} for more information.
```

{@link PluginOptions.groups}

## Checking For Broken Code Links

As your code changes over time, it is easy for the symbol links in your documentation to out of sync, and break. The TypeDoc library has a configuration option you can use to be alerted when this happens. Set the `listInvalidSymbolLinks` TypeDoc configuration option to `true` to enable this feature.

For more information, see [TypeDoc Options](https://typedoc.org/guides/options/).