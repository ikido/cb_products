import React, { Component } from 'react';
import Page from 'views/layout/page';

export default class ProductSearch extends Component {
	render() {
		return (
      <Page
        breadcrumbs={ 'Home / Blank' }
        title='Product search'
      >
        <p>Hello world!</p>
      </Page>
    )
	}
}
