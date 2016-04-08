'use strict';

import { BaseModel } from 'mobx-model';

export default class AttributeType extends BaseModel {
	
	static attributes = {
		caption: '',
		valueType: '',
		localized: false,
		name: ''
	}

}