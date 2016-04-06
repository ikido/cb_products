import React, { PropTypes, Component } from 'react';

export default class ColumnHeader extends Component {

  static propTypes = {
    column: PropTypes.string.isRequired
  }

  render() {
    return <th>{ this.props.column }</th>
  }
}