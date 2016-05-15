import { extendObservable, transaction, autorun } from 'mobx';
import { ColumnsPreset, SearchPreset } from 'models';
import bindAll from 'lodash/bindAll';
import isNumber from 'lodash/isNumber';
import isEmpty from 'lodash/isEmpty';
import { Product } from 'models';
import debounce from 'lodash/debounce';
import uniqueId from 'lodash/uniqueId';
import { SearchStore } from 'stores';

let productSearch = {}

/*
 * These properties are read-only,
 * we don't set them directly and use actions
 * below instead. 
 *
 * This is fine exposing them as long as their structure
 * is simple and flat and is defined here for reference
 */
extendObservable(productSearch, {
	selectedColumnsPresetId: null,
  selectedSearchPresetId: null,
  showColumnsEditor: false,
  showSearchEditor: false,
  columnsCaption: '',
  columns: '',
  query: '',
  queryCaption: '',
  page: 1,
  searching: false,
  searchError: false,

  // search id is used to store and retrieve search results
  searchId: uniqueId('product_search_')
});

Object.assign(productSearch, {
	/*
	 * Update query caption and query itself
	 * when preset was selected or deselected
	 */
	setSelectedSearchPreset(item = null) {
	  let preset, presetId;
		
		presetId = isNumber(item) ? item : (item || {}).value;
	  
	  transaction(() => {
		  this.selectedSearchPresetId = presetId;

		  if (!!presetId) preset = SearchPreset.get(presetId);

		  if (!!preset) {            
		    this.queryCaption = preset.caption;
		    this.query = preset.query;		    
		  } else {
		    this.queryCaption = '';
		    this.query = '';
		  }

		  this.showSearchEditor = false;
		});
	},

	/*
	 * Update columns caption and columns itself
	 * when preset was selected or deselected
	 */
	setSelectedColumnsPreset(item = null) {
	  let preset, presetId;

	  presetId = isNumber(item) ? item : (item || {}).value;

	  transaction(() => {
	    this.selectedColumnsPresetId = presetId;

	    if (!!presetId) preset = ColumnsPreset.get(presetId);

	    if (!!preset) {            
	      this.columnsCaption = preset.caption;
	      this.columns = preset.columns;	      
	    } else {
	      this.columnsCaption = '';
	      this.columns = '';
	    }

	    this.showColumnsEditor = false;

	  });
	},

	// clear selected preset and show the editor
	showNewSearchPresetEditor() {
		transaction(() => {
	  	this.setSelectedSearchPreset(null)
	  	this.showSearchPresetEditor();
	  });
	},

	showNewColumnsPresetEditor() {
		transaction(() => {
	  	this.setSelectedColumnsPreset(null)
	  	this.showColumnsPresetEditor();
	  });
	},

	// show the editor
	showSearchPresetEditor() {
	  this.showSearchEditor = true;
	},

	showColumnsPresetEditor() {
	  this.showColumnsEditor = true;
	},

	setQueryCaption(newValue) {
		this.queryCaption = newValue;
	},

	// update search query and reset search page
	setQuery(newValue) {
		transaction(() => {
			this.query = newValue;
			this.page = 1;
		});
	},

	setColumnsCaption(newValue) {
		this.columnsCaption = newValue;
	},

	setColumns(newValue) {
		this.columns = newValue;
	},

	hideSearchPresetEditor() {
		this.showSearchEditor = false;
	},

	hideColumnsPresetEditor() {
		this.showColumnsEditor = false;
	},

	setPage(newPage) {
		this.page = newPage;
	},

	// prepare columns for components
	getPreparedColumns() {
		let columns = [];

		this.columns.split("\n").forEach(column => {
      let [path, header] = column.split(',')
      if (!isEmpty(path.trim())) {
        columns.push({ path, header })
      }
    })

    return columns;
	},



	/*
   *
   * TODO
   * Actions below are for search results,
   * Actions above are for presets
   * This should be split into two smaller files
   *
   * And maybe state of preset saving/deleting should
   * be moved here as well
   */






	/*
   * Method to actually perform the search
   * We want it in a component to display loading
   * spinners and errors, if any
   */
  performSearch(options = {}) {
    let { query, page, searchId } = options;

    if (isEmpty(query)) return;

    /*
     * Note: I had to move searching and searchError
     * from component state to a separate store
     * to move big performSearch method out of
     * component
     */
    transaction(() => {
    	this.searching = true;
			this.searchError = false;
    })

    /*
     * We use 'search' action in product model that
     * makes API request and returns promise
     */ 
    Product.search({
      query,
      page,
      searchId
    }).then(response => {
      transaction(() => {
	    	this.searching = false;
				this.searchError = !response.ok;
	    })
    })
  },

  startAutoSearch() {
  	let performSearch = this.performSearch;

    // debounced search for query that changes too fast
    let debouncedSearch = debounce(performSearch, 750);

    /*
     * whenever UIStore.productSearch.query or UIStore.productSearch.page changes 
     * callback passed to autorun will be called, performing search with given 
     * query and page
     */    
    this.disposeSearch = autorun(() => {
      let action;

      // if page have changed we can fire action right away
      if (this.previousPage !== this.page) {
        action = performSearch; 

      // otherwise we have to debounce it
      } else {
        action = debouncedSearch;
      }

      /*
       * arguments to debouncedSearch will be
       * passed to performSearch. We need to explicitly
       * access observable properties inside autorun
       * for it to be called when they change
       */
      action({ 
        query: this.query,
        page: this.page,
        searchId: this.searchId
      })

      // save  page for next call
      this.previousPage = this.page;
    });
  },

  stopAutoSearch() {
  	/* 
     * mobx autorun method return a function to dispose search,
     * we should do that when component is going to unmount
     */     
    this.disposeSearch();
  },

  getSearchResults() {
  	return SearchStore.get(this.searchId);
  }

});

export default bindAll(productSearch, [
	'setSelectedSearchPreset',
	'setSelectedColumnsPreset',
	'showNewSearchPresetEditor',
	'showNewColumnsPresetEditor',
	'showSearchPresetEditor',
	'showColumnsPresetEditor',
	'setQuery',
	'setQueryCaption',
	'setColumns',
	'setColumnsCaption',
	'hideSearchPresetEditor',
	'hideColumnsPresetEditor',
	'setPage',
	'performSearch'
]);