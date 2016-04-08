'use strict';

import { extendObservable, asFlat } from 'mobx';

class UIStore {

  constructor() {
    extendObservable(this, {
      productSearch: {
      	columnsCaption: '',
      	columns: '',
      	query: '',
      	selectedColumnPresetId: null
      }
    })
  }

}

export default new UIStore;