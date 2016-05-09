'use strict';

import productSearch from 'stores/ui_store/product_search';

/*
 * This store acts as an aggregate and connects
 * various branches
 */
let UIStore  = {
  notificationSystem: null,
  productSearch
}

export default UIStore;