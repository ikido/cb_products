'use strict';

import React, { Component } from 'react';
import Header from 'views/layout/header';
import Sidebar from 'views/layout/sidebar';
import Footer from 'views/layout/footer';

export default class Layout extends Component {
  render() {
    return (
      <div id='layout'>
      	<Header />
      	<Sidebar />
      	{ this.props.children }
      	<Footer />
      </div>
    );
  }
}
