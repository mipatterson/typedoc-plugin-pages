## Steps

Follow these steps to get started with the TypeDoc Pages Plugin:

1. [Install TypeDoc](#1-install-typedoc)
2. [Install the TypeDoc Pages Plugin](#2-install-the-typedoc-pages-plugin)
3. [Create a page](#3-create-a-page)
4. [Configure the plugin](#4-configure-the-plugin)
5. [Add the Pages Plugin Theme](#5-add-the-pages-plugin-theme)
6. [Run TypeDoc](#6-run-typedoc)

### 1. Install TypeDoc

Run the following command to ensure you have TypeDoc installed:

```
$ npm install --save-dev typedoc
```

### 2. Install the TypeDoc Pages Plugin

Run the following command to ensure you have the TypeDoc Page Plugin installed: 

```
$ npm install --save-dev typedoc-plugin-pages
```

TypeDoc will automatically detect the plugin once it has been installed.

### 3. Create a page

Next, you need to create at least one documentation page. Create a new markdown file, `sample-page.md`, in your repository:

#### `/documentation/sample/sample-page.md`
```markdown
This is a sample documentation page:
- Item 1
- Item 2
- Item 3
```

### 4. Configure the plugin

To configure the plugin, create a `pagesconfig.json` file in the same directory as your `typedoc.json` file:

#### `pagesconfig.json`
```json
{
	"groups": [
		{
			"title": "Documentation",
			"pages": [
				{
					"title": "My Page",
					"source": "./documentation/sample/sample-page.md"
				}
			]
		}
	]
}
```

There are several ways to define plugin configuration. To learn more about configuring the plugin via the `typedoc.json` file or how to customize the plugin configuration file path, see {@page Configuration File}.

### 5. Add the Pages Plugin Theme

To configure TypeDoc to use the integrated Pages Plugin theme, add the following property to your `typedoc.json` file:

`typedoc.json`
```json
{
	"theme": "pages-plugin"
}
```

This option can be passed via the command line as well:

```
$ typedoc --theme pages-plugin
```

### 6. Run TypeDoc

Run TypeDoc to generate your documentation output:

```
$ typedoc
```
