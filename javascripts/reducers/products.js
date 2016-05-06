/*
	Reducers in this case are just wrapper functions (getters) to hide
	store/state implementation from components
 */
'use strict';

import UIStore from 'stores/ui_store';

export default {
	get selectedSearchPresetId() {
		return UIStore.productSearch.selectedSearchPresetId;
	},

	get selectedColumnPresetId() {
		console.log('selectedColumnPresetId in reducer')
		return UIStore.productSearch.selectedColumnPresetId;
	},

	get searchPresetEditorShown() {
		return UIStore.productSearch.showSearchEditor;
	},

	get columnPresetEditorShown() {
		return UIStore.productSearch.showColumnEditor;
	}
	
}