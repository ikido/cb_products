'use strict';

import React, { Component } from 'react';
import Page from 'views/layout/page';

export default class NotFound extends Component {
  render() {
    return (
      <Page
        breadcrumbs={ 'Home / Page not found' }
        title='Product search'
      >
        <h1>Error, page not found</h1>
      </Page>
    );
  }
}
