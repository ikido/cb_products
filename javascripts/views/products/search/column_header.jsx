'use strict';

import React, { PropTypes, Component } from 'react';

export default class ColumnHeader extends Component {

  static propTypes = {
    column: PropTypes.shape({
      path: PropTypes.string.isRequired,
      header: PropTypes.string
    }).isRequired
  }

  render() {
    let col = this.props.column;
    return <th>{ col.header ? col.header : col.path }</th>
  }
}