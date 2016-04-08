'use strict';

import { BaseModel } from 'mobx-model';

class SearchPreset extends BaseModel {
	
	static attributes = {
		caption: '',
		query: '',
		model: ''
	}

}

// create preset for a 'product' model
SearchPreset.addClassAction('createProductPreset', function(attributes = {}) {
	Object.assign(attributes, { model: 'product' });
	return this.create(attributes);
});

export default SearchPreset