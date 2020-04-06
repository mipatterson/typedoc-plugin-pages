## Pages

Pages are files you write that get packaged and rendered along with your documentation output. You can write these files in Markdown or plaintext.

Pages can be organized in several different ways:

1. {@page Page Groups}
2. {@page Child Pages}
3. {@page Page Sections}

For tips about how to organize your pages, see {@page Page Organization}.

## Steps

Follow these steps to create your first page:

1. [Create a new Markdown page](#1-create-a-new-markdown-page)
2. [Define a page group](#2-define-a-page-group)
3. [Define your page](#3-define-your-page)

### 1. Create a new Markdown page

Create a new Markdown page and give it some content.

#### `ExamplePage.md`
```markdown
### Header

Super important list:
- Item 1
- Item 2
- Item 3
```

### 2. Define a page group

Every page is either:

- A member of a page group
- A child of another page

Your configuration must include at least one top-level page group.

To create a top-level page group, first, add a "groups" property to your configuration file. Next, add a new group definition with a "title" property and an empty "pages" array.

#### `pagesconfig.json`
```json
{
	"groups": [
		{
			"title": "Example Page Group",
			"pages": []
		}
	]
}
```

The group title will be displayed as a header in the navigation sidebar and pages that belong to this group will show up under that header.

### 3. Define your page

Add a new page definition to your newly created group, defining a title and source:

#### `pagesconfig.json`
```json
{
	"groups": [
		{
			"title": "Example Page Group",
			"pages": [
				{
					"title": "Example Page",
					"source": "./path/to/ExamplePage.md"
				}
			]
		}
	]
}
```

The "title" property defines what will be displayed in the navigation sidebar and breadcrumbs. The "source" property is the path to your source file. By default, relative paths are relative to the directory you run TypeDoc from.

## Additional Pages and Page Groups

Additional pages and page groups can be created by adding additional page and page group definitions in your configuration. See {@page Ordering Pages} for information on order your pages and page groups.

## Sub-Pages

You can also add pages and page groups as children of your other pages. For more information, see {@page Child Pages} and {@page Sub-Groups}.