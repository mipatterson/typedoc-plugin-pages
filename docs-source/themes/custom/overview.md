It is possible to use the TypeDoc Pages Plugin with both third-party TypeDoc themes and your own custom themes. Both requires making some small modifications to the themes.

If you're using your own custom theme, it should be trivial to modify the theme source code. If you're using this plugin with a third-party TypeDoc theme, it is likely that you're consuming the theme via npm. In this scenario, it is recommended that you create a local copy of the theme and make the necessary modifications.

## How to modify a TypeDoc theme to support the Pages Plugin:

The following steps detail the modifications that need to be done to a theme to make it compatible with this plugin:

1. Add a Handlebars template for rendering your Markdown pages

	Inside your theme's `templates` directory create a new Handlebars file, `markdown-page.hbs` with the following contents:

	```handlebars
	<div class="tsd-panel tsd-typography">
		{{#markdown}}{{{model.pagesPlugin.item.contents}}}{{/markdown}}
	</div>
	```

	This is the file that will be responsible for rendering your Markdown pages. You may modify this file to meet the needs of your theme.

2. Add custom styles for plugin components

	By default, this plugin will add new items to your theme's existing navigation component. It is a good idea to style these items to best suit your theme. The following is a list of classes, for which you may want to add styling rules to your theme's CSS:

	- `pp-nav`: Class added to all navigation items, including groups, pages, child pages, and sections
	- `pp-group`: Class added to all group navigation items
	- `pp-page`: Class added to all page navigation items
	- `pp-parent`: Class added to all page navigation items that have child pages
	- `pp-active`: Class added to parent page navigation items when the parent page or any of its child pages are the current page
	- `pp-child`: Class added to all child page navigation items

	Additionally, search results for pages added by this plugin will be given the `tsd-kind-page` class. You can customize the icon of these search results with the following styles:

	```css
	.tsd-kind-page .tsd-kind-icon:before {
		display: inline-block;
		vertical-align: middle;
		height: 16px;
		width: 16px;
		content: "";
		background-image: url("../images/page-icon.svg");
		background-size: 16px 16px;
	}
	```

	The above code sample will use the image located at `/assets/images/page-icon.svg` for the search result icon. You can find a sample icon image in the built-in theme, [here](https://github.com/mipatterson/typedoc-plugin-pages/blob/master/theme/v2/assets/images/page-icon.svg).

	> NOTE: For styling examples, see the built-in theme's [stylesheet](https://github.com/mipatterson/typedoc-plugin-pages/blob/master/theme/v2/assets/css/pages.css).