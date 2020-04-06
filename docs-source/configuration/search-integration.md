By default, the plugin adds all of your registered pages to the TypeDoc search index, making them searchable.

This can be overriden by setting the {@link PluginOptions.enableSearch} configuration option to `false`.

#### `typedoc.json`

```json
{
	"pages": {
		"enableSearch": false
	}
}
```