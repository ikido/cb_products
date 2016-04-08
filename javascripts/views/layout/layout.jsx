'use strict';

import React, { Component } from 'react';
import Header from 'views/layout/Header';
import Sidebar from 'views/layout/Sidebar';
import Footer from 'views/layout/Footer';

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
