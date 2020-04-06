The TypeDoc Pages Plugin comes with a built-in theme option. The built-in theme extends the default TypeDoc theme and includes:

- A navigation sidebar for your custom documentation pages
- Support for custom markdown-based page content

To use the built-in theme, pass "pages-plugin" as the TypeDoc theme option:

Via command line:

```
$ typedoc --theme "pages-plugin"
```

Via the `typedoc.json` configuration file:

```
{
	theme: "pages-plugin"
}
```
