import React, { Component } from 'react';
import Page from 'views/layout/page';
import Table from 'react-bootstrap/lib/Table';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import uniqueId from 'lodash/uniqueId';
import isEmpty from 'lodash/isEmpty';
import result from 'lodash/result';
import toString from 'lodash/toString';

import { Product, AttributeType } from 'models';
import { SearchStore } from 'stores';

export default class ProductSearch extends Component {

  state = {
    preloading: false,
    searching: false,
    columns: '',
    query: '_exists_: attributes.ansi_lumen AND Hitachi',
    page: 1
  };

  searchId = uniqueId('product_search_');

  componentWillMount() {
    this.setState({ preloading: true });
    
    AttributeType.loadAll().then(response => {
      if (response.ok) {
        this.setState({ preloading: false });
      }
    });
  }

  handleColumnsChange = (e) => {
    this.setState({ columns: e.target.value });
  }

  handleQueryChange = (e) => {
    this.setState({ query: e.target.value });
  }

  handleSearch = () => {
    this.setState({ searching: true });

    Product.search({
      query: this.state.query,
      page: this.state.page,
      searchId: this.searchId
    }).then(response => {
      if (response.ok) {
        this.setState({ searching: false });
      }
    })
  }

  renderPreloading() {
    return <h1>Preloading...</h1>
  }

  renderSearching() {
   return <h1>Searching...</h1> 
  }

  renderSearchResults() {
    let searchResults = SearchStore.get(this.searchId)

    if (!searchResults || isEmpty(searchResults.results)) {
      
      return <h1>Nothing found</h1>

    } else {
      let products = searchResults.results.map(id => Product.get(id))
      let columns = this.state.columns.split("\n");

      return (
        <Table bordered responsive>
          <thead>
            <tr>
              <th>#</th>
              { columns.map((columnName, index) => 
                <th key={ index }>{ columnName }</th>
              )}
            </tr>
          </thead>
          <tbody>
            { products.map((product, index) => 
              <tr key={ product.id }>
                <td>{ index }</td>
                { columns.map((columnName, colIndex) => 
                  <td key={ colIndex }>{ toString(result(product.toJson(), columnName)) }</td>
                )}
              </tr>
            )}
          </tbody>
        </Table>
      )
    }
  }

  renderSearch() {
    return (
      <div>
        <Row>
          <Col md={6}>
            <Input
              type="textarea"
              label="Columns"
              value={ this.state.columns }
              onChange={ this.handleColumnsChange }
              rows={10}
            />
          </Col>
          <Col md={6}>
            <Input
              type="textarea"
              label="Search query"
              value={ this.state.query }
              onChange={ this.handleQueryChange }
              rows={10}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <p>
              <Button bsStyle="success" onClick={ this.handleSearch }>Search</Button>
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            { this.state.searching ? this.renderSearching() : this.renderSearchResults() }            
          </Col>
        </Row>
      </div>
    )
  }

	render() {
		return (
      <Page
        breadcrumbs={ 'Home / Blank' }
        title='Product search'
      >
        { this.state.preloading ? this.renderPreloading() : this.renderSearch() }
      </Page>
    )
	}
}
