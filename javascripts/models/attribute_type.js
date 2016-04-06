'use strict';

import { BaseModel } from 'mobx-model';

export default class AttributeType extends BaseModel {

	static urlRoot = '/attribute-type';
	
	static attributes = {
		caption: '',
		valueType: '',
		localized: false,
		name: ''
	}

}