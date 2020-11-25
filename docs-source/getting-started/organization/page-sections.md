Sometimes you may have so many pages that the navigation sidebar feels cluttered, even when using child pages. Page sections can be used to simplify the navigation structure.

Page sections do not have a source file associated with them, but instead have their own nested groups. When the user clicks a page section link in the navigation sidebar, the groups that are nested under that section will be displayed in the sidebar and the previous groups will disappear. Additionally, a new link will be added to the top of the navigation sidebar allowing users to navigate back to the parent groups.

## Creating Page Sections

Follow these steps to create a page section:

1. Create a JSON definition for the section:

```json
{
	"title": "My Group",
	"groups": []
}
```

2. Add the section definition JSON to either:

	- The `pages` array of a page group
	- The `children` array of a parent page

## Section Options

In addition to the required `title` and `groups` properties, page section definitions support two optional properties:

### 1. Output

The optional `output` property supports configuring the name of the directory that pages and groups within the section are rendered to.

> 👉 For example, the following page definiton would be rendered to `outer-group/my-section/inner-group/my-page.html`:

```json
{
	"groups": [
		{
			"title": "Outer Group",
			"output": "outer-group",
			"pages": [
				{
					"title": "My Section",
					"output": "my-section",
					"groups": [
						{
							"title": "Inner Group",
							"output": "inner-group",
							"pages": [
								{
									"title": "My Page",
									"source": "my-page.md",
									"output": "my-page.html"
								}
							]
						}
					]
				}
			]
		}
	]
}
```

If no `output` property is provided, the section's title will be used as the default value.

### 2. Source

The optional `source` property allows you to configure a default path prefix for the `source` property of each group within the section.

> 👉 For example, the following page would be read from `outer-group/my-section/inner-group/my-page.md`:

```json
{
	"groups": [
		{
			"title": "Outer Group",
			"source": "outer-group",
			"pages": [
				{
					"title": "My Section",
					"source": "my-section",
					"groups": [
						{
							"title": "Inner Group",
							"source": "inner-group",
							"pages": [
								{
									"title": "My Page",
									"source": "my-page.md",
								}
							]
						}
					]
				}
			]
		}
	]
}
```

By default, no source path prefix is applied when the `source` property is omitted.