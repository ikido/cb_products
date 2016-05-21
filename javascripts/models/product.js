'use strict';

import { API, BaseModel } from 'mobx-model';
import { SearchStore } from 'stores';

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

    let { query, page, searchId, perPage } = options;

    return API.request({
      data: { page, per_page: perPage, es_query: query, column_type: 'objects' },
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

  uploadFile(attributes = {}) {
    return API.request({
      method: 'post',
      fileData: { attibuteName: 'file', file: attributes.file },
      endpoint: `/file_attributes/product/${this.id}/${attributes.attributeTypeName}`,
      onSuccess: (response) => {
        console.log(response);
        this.set({ modelJson: response.body.holder });
      }
    });
  }

}