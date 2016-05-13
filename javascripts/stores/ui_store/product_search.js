import { extendObservable, transaction } from 'mobx';
import { ColumnsPreset, SearchPreset } from 'models';
import bindAll from 'lodash/bindAll';
import isNumber from 'lodash/isNumber';

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
  queryCaption: ''
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
	  this.setSelectedSearchPreset(null)
	  this.showSearchPresetEditor();
	},

	showNewColumnsPresetEditor() {
	  this.setSelectedColumnsPreset(null)
	  this.showColumnsPresetEditor();
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

	setQuery(newValue) {
		this.query = newValue;
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
	'hideColumnsPresetEditor'
]);