import React, { Component } from 'react';

export default class Layout extends Component {
  render() {
    return (
      <div id='layout'>
      	{ this.props.children }
      </div>
    );
  }
}
