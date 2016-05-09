'use strict';

import productSearch from 'stores/ui_store/product_search';
import notification from 'stores/ui_store/notification';

/*
 * This store acts as an aggregate and connects
 * various branches
 */
let UIStore  = {
  notification,
  productSearch
}

export default UIStore;