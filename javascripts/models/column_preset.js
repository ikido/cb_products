'use strict';

import { BaseModel } from 'mobx-model';

class ColumnPreset extends BaseModel {
	
	static attributes = {
		caption: '',
		columns: '',
		model: ''
	}

	static getSelectOptions = function() {
    return this.all().slice().map(preset => {
      return { value: preset.id, label: preset.caption }
    });
  }

}

// create preset for a 'product' model
ColumnPreset.addClassAction('createProductPreset', function(attributes = {}) {
	Object.assign(attributes, { model: 'product' });
	return this.create(attributes);
});

export default ColumnPreset