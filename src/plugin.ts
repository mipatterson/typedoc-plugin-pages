/**
 * @packageDocumentation
 * @module Plugin
 */

import { Converter } from "typedoc/dist/lib/converter/converter";
import { Component, RendererComponent } from "typedoc/dist/lib/output/components";
import { MarkdownEvent, PageEvent, RendererEvent } from "typedoc/dist/lib/output/events";
import { PLUGIN_NAME } from "./constants";
import { OptionManager } from "./options/option-manager";
import { PageLinkParser } from "./links/page-link-parser";
import { OptionValidator } from "./options/option-validator";
import { PageDictionaryFactory } from "./pages/page-dictionary-factory";
import { NavigationItemFactory } from "./rendering/navigation-item-factory";
import { NavigationRenderer } from "./rendering/navigation-renderer";
import { PageRenderer } from "./rendering/page-renderer";
import { SearchIndexParser } from "./search/search-index-parser";
import { SearchManager } from "./search/search-manager";
import { ThemeManager } from "./theme/theme-manager";

/**
 * Pages plugin for integrating your own pages into documentation output
 */
@Component({ name: PLUGIN_NAME })
export class PagesPlugin extends RendererComponent {
	private _optionManager: OptionManager;
	private _themeManager: ThemeManager;
	private _pageDictionaryFactory: PageDictionaryFactory;
	private _pageRenderer: PageRenderer;
	private _navigationRenderer: NavigationRenderer;
	private _pageLinkParser: PageLinkParser;
	private _searchManager: SearchManager;

	/**
	 * Create a new plugin instance.
	 */
  	public initialize(): void {
		this._optionManager = new OptionManager(new OptionValidator());
		this._themeManager = new ThemeManager();
		this._pageDictionaryFactory = new PageDictionaryFactory();
		
		// Listen for TypeDoc Converter events
		this.listenTo(this.application.converter, {
			[Converter.EVENT_RESOLVE_BEGIN]: this._converterResolveBeginEventHandler,
		});

		// Listen for TypeDoc events
        this.listenTo(this.owner, {
			[RendererEvent.BEGIN]: this._renderBeginEventHandler,
			[RendererEvent.END]: this._renderEndEventHandler,
			[PageEvent.BEGIN]: this._pageBeginEventHandler,
			[MarkdownEvent.PARSE]: this._parseMarkdownEventHandler,
		});
	}

	private _converterResolveBeginEventHandler(): void {
		// Apply the plugin theme
		this._themeManager.applyTheme(this.application.renderer, this.application.options);
	}

	/**
     * An event emitted by the Renderer class at the very beginning and ending of the entire rendering process.
     *
     * @param event  An event object describing the current render operation.
     */
	private _renderBeginEventHandler(event: RendererEvent): void {
		// Retrieve and validate plugin options
		const options = this._optionManager.getPluginOptions(this.application.options);

		// Parse the pages and groups from options
		const pageDictionary = this._pageDictionaryFactory.buildDictionary(options);

		// Create necessary dependencies
		this._pageRenderer = new PageRenderer(options, pageDictionary);
		this._navigationRenderer = new NavigationRenderer(options, pageDictionary, new NavigationItemFactory());
		this._pageLinkParser = new PageLinkParser(options, pageDictionary, this.application.logger);
		this._searchManager = new SearchManager(options, pageDictionary, new SearchIndexParser());

		// Generate pages to be rendered
		this._pageRenderer.addPluginDataToAllPages(event);
		this._pageRenderer.replaceGlobalsPage(event);
		this._pageRenderer.addPluginPagesForRendering(event);
	}

	/**
     * Triggered before a document will be rendered.
     * @param event TypeDoc Page event
     */
    private _pageBeginEventHandler(event: PageEvent): void {
		// Track the current page being rendered
		this._pageLinkParser.setCurrentPage(event);

		// Render plugin navigation for page
		this._navigationRenderer.addPluginNavigation(event);
	}

	/**
	 * Triggered when TypeDoc is parsing Markdown
	 * @param event TypeDoc Markdown event
	 */
	private _parseMarkdownEventHandler(event: MarkdownEvent): void {
		// Parse any page links in the Markdown
		this._pageLinkParser.parsePageLinks(event);
	}

	/**
	 * Triggered when rendering is complete
	 * @param event TypeDoc Renderer event
	 */
	private _renderEndEventHandler(event: RendererEvent): void {
		// Populate the TypeDoc search index
		this._searchManager.populateSearchIndex(event);

		// List any invalid page links
		this._pageLinkParser.listInvalidPageLinks();
	}
}