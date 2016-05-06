'use strict';

/*
  Actions are merely a number of setters that make store
  semi-immutable and hide away its implementation
 */

import UIStore from 'stores/ui_store';
import { ColumnPreset, SearchPreset } from 'models';
import { transaction } from 'mobx';

/*
  when preset is selected we want to
    - set queryCaption
    - set query
    - hide search query editor if a valid preset was selected
*/
export function setSelectedSearchPreset(item = null) {
  let preset, presetId = (item || {}).value;
  
  UIStore.productSearch.selectedSearchPresetId = presetId;

  if (!!presetId) preset = SearchPreset.get(presetId);

  if (!!preset) {            
    UIStore.productSearch.queryCaption = preset.caption;
    UIStore.productSearch.query = preset.query;
    UIStore.productSearch.showSearchEditor = false;  
  } else {
    UIStore.productSearch.queryCaption = '';
    UIStore.productSearch.query = '';
  }
}

export function setSelectedColumnPreset(item = null) {  
  let preset, presetId = (item || {}).value;

  transaction(() => {
  
    UIStore.productSearch.selectedColumnPresetId = presetId;

    if (!!presetId) preset = ColumnPreset.get(presetId);

    if (!!preset) {            
      UIStore.productSearch.columnsCaption = preset.caption;
      UIStore.productSearch.columns = preset.columns;
      UIStore.productSearch.showColumnsEditor = false;  
    } else {
      UIStore.productSearch.columnsCaption = '';
      UIStore.productSearch.columns = '';
    }

  });
}

// clear selected preset and show the editor
export function showNewSearchPresetEditor() {
  setSelectedSearchPreset(null)
  showSearchPresetEditor();
}

export function showNewColumnPresetEditor() {
  setSelectedColumnPreset(null)
  showColumnPresetEditor();
}

// show the editor
export function showSearchPresetEditor() {
  UIStore.productSearch.showSearchEditor = true;
}

export function showColumnPresetEditor() {
  UIStore.productSearch.showColumnsEditor = true;
}