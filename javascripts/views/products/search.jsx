import React, { Component } from 'react';
import Page from 'views/layout/page';
import Table from 'react-bootstrap/lib/Table';
import { AttributeType } from 'models';

export default class ProductSearch extends Component {

  componentDidMount() {
    AttributeType.loadAll();
  }

	render() {
		return (
      <Page
        breadcrumbs={ 'Home / Blank' }
        title='Product search'
      >
        <Table bordered responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name 1</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan="2">Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </Page>
    )
	}
}
