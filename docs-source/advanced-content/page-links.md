There are two ways to link to your pages:

1. `@page` and `@pageLink` tags
2. Standard Markdown links

Both of these methods work on your documentation pages, as well as within your TypeDoc comments in your code. So you can use them to link directly to your documentation pages from your reflection documentation.

### `@page` and `@pagelink` Tags

This plugin supports `@page` and `@pagelink` tags which allow you to create links to pages based on their titles. For example, the below Markdown will produce a link to the page entitled "Advanced Usage".

```markdown
See {@page Advanced Usage} for more information.
```

#### Disabling Page Links

Page links are enabled by default. To disable page links, set the {@link PluginOptions.enablePageLinks} option to `false`.

#### Invalid Page Links

Any `@page` or `@pagelink` tags that don't point to valid pages or page groups will not be replaced. The TypeDoc Pages Plugin can be configured to warn you of these "invalid" page links in a similar way to TypeDoc's `listInvalidSymbolLinks` option.

To have any invalid page links be written to the console, set the {@link PluginOptions.listInvalidPageLinks} option to `true`.

To fail the TypeDoc build when invalid page links are found, set the {@link PluginOptions.failBuildOnInvalidPageLink} option to `true`.

### Standard Markdown Links

If you know the relative path to the output HTML page from the page the link is on, you can use the standard Markdown hyperlink syntax to create a link to that page.

```markdown
Click [here](../relative/url/to/page.html) for more information.
```

Keep in mind that if you update your page configuration, you may break some links.