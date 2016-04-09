'use strict';

import { BaseModel } from 'mobx-model';

class ColumnPreset extends BaseModel {
	
	static attributes = {
		caption: '',
		columns: '',
		model: ''
	}

}

// create preset for a 'product' model
ColumnPreset.addClassAction('createProductPreset', function(attributes = {}) {
	Object.assign(attributes, { model: 'product' });
	return this.create(attributes);
});

export default ColumnPreset