'use strict';

import { extendObservable, asFlat } from 'mobx';

class SearchStore {

  constructor() {
    extendObservable(this, {
      searchResults: asFlat([])
    })
  }

  /*
   *
   * Public methods
   *
   */

  get = (id) => {
    var results = this._findResults(id);
    return results ? results.values : undefined;
  }

  set = (id, json) => {
    var results = this._findResults(id);
    if (results) {      
      results.values = json;
    } else {
      this.searchResults.push({ id, values: json });
    }
  }




  /*
   *
   * Private methods
   *
   */

  _findResults(id) {
    console.log(this)
    return this.searchResults.find(results => 
      results.id === id
    );
  }
  
}

export default new SearchStore;