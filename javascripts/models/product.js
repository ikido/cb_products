'use strict';

import { API, BaseModel } from 'mobx-model';
import { SearchStore } from 'stores';

export default class Product extends BaseModel {

	static perPage = 20;
	
	static attributes = {
		eanOrUpc: null,
		erpId: null,
		mpn: null,
		outlets: [],
		ids: [],
		erpDescription: null,
		attributes: [],
		manufacturerId: null,
		manufacturer: null
	}

	static search = function(options) {

		let { query, page, searchId } = options;

		return API.request({
      data: { page, per_page: this.constructor.perPage, es_query: query, column_type: 'objects' },
      endpoint: this.urlRoot,
      onSuccess: (response) => {
      	let products = response.body;
      	
      	// save found products to cache
      	products.forEach(productJson => {
      		this.set({ modelJson: productJson })
      	})

      	// set search results
        SearchStore.set(searchId, {
        	results: response.body.map(p => p.id),
        	total: response.header['x-total-count'],
        	page
        });
      }
    });
	}

}