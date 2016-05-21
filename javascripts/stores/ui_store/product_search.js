import { extendObservable, transaction, autorun } from 'mobx';
import { ColumnsPreset, SearchPreset } from 'models';
import bindAll from 'lodash/bindAll';
import isNumber from 'lodash/isNumber';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';

/*
 * Returns array of param objects, each with name, prefix and empty value
 */
const __getParamsFromQuery = function(query) {
	const pattern = /\{(.+?)\}/g; // [user|userParam]
  
  let match, matches = [];

  while (match = pattern.exec(query)) {
    matches.push(match[1]);
  }

  // console.log(query, pattern, matches)

  return matches.map(match => {
  	let [name, prefix] = match.split(':');

  	return {
  		name,
  		prefix,
  		value: ''
  	}
  })
}


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
  userParams: []
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
		    this.setQueryCaption(preset.caption);
		    this.setQuery(preset.query);
		  } else {
		    this.this.setQueryCaption('');
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

	setUserParam(name, value) {
		// console.log('setUserParam', name, value)
		let param = find(this.userParams, { name });
		if (param) param.value = value;
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
	'setPage'
]);