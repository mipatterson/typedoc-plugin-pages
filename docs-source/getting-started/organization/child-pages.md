You can add pages as children of other pages. These will display as indented links under their parent page in the navigation sidebar. Child pages may **not** have their own children. However, they can have sub-groups. See {@page Sub-Groups} for more information.

To add a page as a child of another page, simply add the child page as an object in a "children" array property on the parent page's definition:

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
						"path": "./path/to/parent-page.md",
						"children": [
							{
								"title": "Child Page",
								"path": "./path/to/child-page.md"
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

The "children" property is optional. Not specifying a "children" property on your page definition is the same as specifying the property as an empty array.