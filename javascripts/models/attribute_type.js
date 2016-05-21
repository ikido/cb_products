'use strict';

import { BaseModel } from 'mobx-model';
import { autorun } from 'mobx';

export default class AttributeType extends BaseModel {
  
  static attributes = {
    caption: '',
    valueType: '',
    localized: false,
    name: ''
  };

  // calculated list of attribute names to display dropzone for
  static fileAttributes = [];

}

/*
 * AttributeType.fileAttributes will be updated once any of the
 * attribute types will be updated
 */
autorun(() => {
  AttributeType.fileAttributes = AttributeType.all()
    .slice()
    .filter(a => a.valueType === 'File')
    .map(a => a.name)
})

