'use strict';

import { extendObservable, asFlat } from 'mobx';

class UIStore {

  constructor() {
    extendObservable(this, {
      productSearch: {
      	columnsCaption: '',
      	columns: '',
      	query: '',
        queryCaption: '',
      	selectedColumnPresetId: null,
        selectedSearchPresetId: null
      }
    })
  }

}

export default new UIStore;