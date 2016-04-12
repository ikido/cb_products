'use strict';

import React, { PropTypes, Component } from 'react';
import toString from 'lodash/toString';
import result from 'lodash/result';
import isArray from 'lodash/isArray';
import includes from 'lodash/includes';
import { AttributeType } from 'models';

export default class ProductColumn extends Component {
  static propTypes = {
    column: PropTypes.shape({
    	path: PropTypes.string.isRequired,
    	header: PropTypes.string
    }).isRequired,
    product: PropTypes.object.isRequired
  }

  render() {
    //console.log('AttributeType.fileAttributes', AttributeType.fileAttributes)
    let [attibutes, attrName] = this.props.column.path.split('.').slice(-2);
    let columnValue = result(this.props.product.toJSON(), this.props.column.path);

    if (!!columnValue && attibutes === 'attributes' && includes(AttributeType.fileAttributes, attrName)) {
      columnValue = !!columnValue.slice ? columnValue.length : 1;
    } else {
      columnValue = toString(columnValue);
    }
    
    return <td>{ columnValue }</td>
  }
}