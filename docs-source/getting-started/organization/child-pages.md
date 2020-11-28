Child pages can be used to nest pages as children under other pages.

In the built-in plugin theme, these will display as indented links under their parent page in the navigation sidebar and will only display when the page, its parent page, or a sibling page is active.

Child pages may **not** have their own children.

## Creating Child Pages

To add a page as a child of another page, simply add the child page as an object in a `children` array property on the parent page's definition:

#### `typedoc.json`

```json
{
	"pages": {
		"groups": [
			{
				"title": "Example Group",
				"pages": [
					{
						"title": "Parent Page",
						"source": "./path/to/parent-page.md",
						"children": [
							{
								"title": "Child Page",
								"source": "./path/to/child-page.md"
							}
						]
					}
				]
			}
		]
	},
	"theme": "pages-plugin"
}
```

The `children` property is optional. Not specifying a `children` property on your page definition is the same as specifying the property as an empty array.
