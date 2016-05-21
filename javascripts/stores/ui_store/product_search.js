'use strict';

import { extendObservable, transaction, autorun, toJSON } from 'mobx';
import { ColumnsPreset, SearchPreset, Product } from 'models';
import { SearchStore } from 'stores';

import bindAll from 'lodash/bindAll';
import isNumber from 'lodash/isNumber';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import uniqueId from 'lodash/uniqueId';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

const userParamPattern = /\{(.*?)\}/g; // [user|userParam]

/*
 * Returns array of param objects, each with name, prefix and empty value
 */
const __getParamsFromQuery = function(query) {	
  let match, matches = [];

  while (match = userParamPattern.exec(query)) {
    matches.push(match[1]);
  };

  return matches.map((match, id) => {
		const [name, prefix] = match.split(':');
		return { id, name, prefix, value: '' };
  })
}

const __applyUserParamsToQuery = function(query = '', userParams = []) {
	let id = 0;

	let newQuery = query.replace(userParamPattern, (match) => {
		let replacement;
		const param = find(userParams, { id });

		if (!isEmpty(param.value)) {
			replacement = isEmpty(param.prefix) ? param.value : `${param.prefix.toUpperCase()} ${param.value}`;
		} else {
			replacement = '';
		}

		id++;
		return replacement;
	});

	//console.log('__applyUserParamsToQuery', query, newQuery);
	return newQuery;
};


let productSearch = {};

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
  userParams: [],
  searching: false,
  searchError: false
});

Object.assign(productSearch, {

	// unique id for product search
	searchId: uniqueId('product_search_'),

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
		    this.setQueryCaption(preset.caption);
		    this.setQuery(preset.query);
		  } else {
		    this.setQueryCaption('');
		    this.setQuery('');
		  }

		  this.hideSearchPresetEditor();
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
	      this.setColumnsCaption(preset.caption);
	      this.setColumns(preset.columns);	      
	    } else {
	      this.setColumnsCaption('');
	      this.setColumns('');
	    }

	    this.hideColumnsPresetEditor();

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
			this.userParams = __getParamsFromQuery(newValue);
		});
	},

	setColumnsCaption(newValue) {
		this.columnsCaption = newValue;
	},

	setColumns(newValue) {
		this.columns = newValue;
	},

	// TODO: should we reset unsaved changes in query?
	hideSearchPresetEditor() {
		this.showSearchEditor = false;
	},

	// TODO: should we reset unsaved changes in columns?
	hideColumnsPresetEditor() {
		this.showColumnsEditor = false;
	},

	setPage(newPage) {
		this.page = newPage;
	},

	setUserParam(id, value) {
		// console.log('setUserParam', name, value)
		let param = find(this.userParams, { id });
		if (param) param.value = value;
	},

	startAutoSearch() {
		// debounced search for query that changes too fast
    let debouncedSearch = debounce(this.performSearch, 750);

    /*
     * whenever UIStore.productSearch.query or UIStore.productSearch.page changes 
     * callback passed to autorun will be called, performing search with given 
     * query and page
     */
    this.disposeSearch = autorun(() => {
      let action;

      // if page have changed we can fire action right away
      if (this.query !== this.previousQuery || !isEqual(toJSON(this.userParams), this.previousUserParams)) {        
        action = debouncedSearch;

      // otherwise we have to debounce it
      } else {
        action = this.performSearch;
      }

      /*
       * arguments to debouncedSearch will be
       * passed to performSearch. We need to explicitly
       * access observable properties inside autorun
       * for it to be called when they change
       */
      action({ 
        query: __applyUserParamsToQuery(this.query, toJSON(this.userParams)),
        page: this.page,
      })

      // save page & userParams for next call
      this.previousQuery = this.query;
      this.previousUserParams = toJSON(this.userParams);
    });
	},

	stopAutoSearch() {
    /* 
     * mobx autorun method return a function to dispose search,
     * we should do that when component is going to unmount
     */
     this.disposeSearch();
	},

	/*
   * Method to actually perform the search
   * We want it in a component to display loading
   * spinners and errors, if any
   */
  performSearch(options = {}) {
    let { query, page } = options;

    if (isEmpty(query)) return;

    // console.log('performSearch', query)

    transaction(() => {
    	this.searching = true;
    	this.searchError = false;
    });

    /*
     * We use 'search' action in product model that
     * makes API request and returns promise
     */ 
    Product.search({
      query,
      page,
      searchId: this.searchId
    }).then(response => {
    	transaction(() => {
    		this.searching = false;
    		this.searchError = !response.ok;
    	})
    })
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