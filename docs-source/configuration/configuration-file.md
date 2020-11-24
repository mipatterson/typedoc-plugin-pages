There are several options for defining plugin configuration:

1. Use TypeDoc's `typedoc.json` file
2. Use a dedicated `pagesconfig.json` file
3. Use a custom JSON configuration file

## 1. Use TypeDoc's `typedoc.json` file

If you are configuring TypeDoc via the `typedoc.json` configuration file, you can embed your plugin configuration directly into this file. All plugin configuration options can be specified as properties of the `pages` property in your `typedoc.json` file:

#### `typedoc.json`
```json
{
	"inputFiles": ["./src"],
	"name": "TypeDoc Pages Plugin",
	"out": "docs",
	"readme": "./docs-source/introduction.md",
	"theme": "pages-plugin",
	"pages": {
		"groups": [],
		"output": "pages",
		"autoDetectPageTitle": true
	}
}
```

```
autoDetectPageTitle: boolean // Use title from first line of Markdown files
```

## 2. Use a dedicated `pagesconfig.json` file

If you are not using a `typedoc.json` configuration file, or if you would like to separate your plugin configuration from the TypeDoc configuration, you can define your plugin configuration in a `pagesconfig.json` file in the directory where TypeDoc will be executed from:

#### `pagesconfig.json`
```json
{
	"groups": [],
	"output": "pages"
}
```

## 3. Use a custom JSON configuration file

Finally, if you would like to customize the location or name of your dedicated JSON configuration file, pass the path to TypeDoc as the `pages` configuration option either via your `typedoc.json` file or command line parameters:

#### `typedoc.json`
```json
{
	"inputFiles": ["./src"],
	"name": "TypeDoc Pages Plugin",
	"out": "docs",
	"readme": "./docs-source/introduction.md",
	"theme": "pages-plugin",
	"pages": "./path/to/your/configuration.json"
}
```

#### Command Line
```
$ typedoc --pages ./path/to/your/configuration.json
```