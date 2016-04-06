import React, { PropTypes, Component } from 'react';
import toString from 'lodash/toString';
import result from 'lodash/result';

export default class ProductColumn extends Component {

  static propTypes = {
    column: PropTypes.string.isRequired,
    product: PropTypes.object.isRequired
  }

  render() {
    let columnValue = result(this.props.product.toJson(), this.props.column);
    return <td>{ toString(columnValue) }</td>
  }
}