'use strict';

import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import toString from 'lodash/toString';
import result from 'lodash/result';
import ProductColumn from 'views/products/search/product_column';
import { openPath } from 'lib/utils';

@observer
export default class ProductRow extends Component {

  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    product: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
  };

  handleDoubleClick = () => {
    openPath(`/products/product/${this.props.product.id}/overview`)
  }

  render() {
    return (
    	<tr onDoubleClick={ this.handleDoubleClick }>
        <td>{ this.props.index }</td>
        { this.props.columns.map((column, index) => 
        	<ProductColumn column={ column } product={ this.props.product } key={ index } />
        )}
      </tr>
    )
  }
}