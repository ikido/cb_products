import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import toString from 'lodash/toString';
import result from 'lodash/result';
import ProductColumn from 'views/products/product_column';

@observer
export default class ProductRow extends Component {

  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    product: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
  };

  render() {
    return (
    	<tr>
        <td>{ this.props.index }</td>
        { this.props.columns.map((column, index) => 
        	<ProductColumn column={ column } product={ this.props.product } key={ index } />
        )}
      </tr>
    )
  }
}