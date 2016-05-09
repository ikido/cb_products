import { extendObservable, transaction } from 'mobx';
import { ColumnPreset, SearchPreset } from 'models';
import bindAll from 'lodash/bindAll';

let productSearch = {}

/*
 * Theese properties are read-only,
 * we don't set them directly and use actions
 * below instead. 
 *
 * This is fine exposing them as long as their structure
 * is simple and flat and is defined here for reference
 */
extendObservable(productSearch, {
	selectedColumnPresetId: null,
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
	  let preset, presetId = (item || {}).value;
	  
	  transaction(() => {
		  this.selectedSearchPresetId = presetId;

		  if (!!presetId) preset = SearchPreset.get(presetId);

		  if (!!preset) {            
		    this.queryCaption = preset.caption;
		    this.query = preset.query;
		    this.showSearchEditor = false;  
		  } else {
		    this.queryCaption = '';
		    this.query = '';
		  }
		});
	},

	/*
	 * Update columns caption and columns itself
	 * when preset was selected or deselected
	 */
	setSelectedColumnPreset(item = null) {
	  let preset, presetId = (item || {}).value;

	  transaction(() => {
	    this.selectedColumnPresetId = presetId;

	    if (!!presetId) preset = ColumnPreset.get(presetId);

	    if (!!preset) {            
	      this.columnsCaption = preset.caption;
	      this.columns = preset.columns;
	      this.showColumnsEditor = false;  
	    } else {
	      this.columnsCaption = '';
	      this.columns = '';
	    }

	  });
	},

	// clear selected preset and show the editor
	showNewSearchPresetEditor() {
	  this.setSelectedSearchPreset(null)
	  this.showSearchPresetEditor();
	},

	showNewColumnPresetEditor() {
	  this.setSelectedColumnPreset(null)
	  this.showColumnPresetEditor();
	},

	// show the editor
	showSearchPresetEditor() {
	  this.showSearchEditor = true;
	},

	showColumnPresetEditor() {
	  this.showColumnsEditor = true;
	}

});

export default bindAll(productSearch, [
	'setSelectedSearchPreset',
	'setSelectedColumnPreset',
	'showNewSearchPresetEditor',
	'showNewColumnPresetEditor',
	'showSearchPresetEditor',
	'showColumnPresetEditor'
]);