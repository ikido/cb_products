'use strict';

import { API, BaseModel } from 'mobx-model';
import { SearchStore } from 'stores';
import { underscore } from 'inflection';

export default class Product extends BaseModel {
	
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
      data: { page, per_page: 20, es_query: query, column_type: 'objects' },
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
        	total: response.header['x-total-count']
        });
      }
    });
	}

	toJson() {
		let json = { id: this.id }

		Object.keys(this.constructor.attributes).forEach(attributeName => {
			json[underscore(attributeName)] = this[attributeName]
		})

		// TODO: add relation ids here as well

		return json;
	}

}