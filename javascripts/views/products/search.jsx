import React, { Component } from 'react';
import Page from 'views/layout/page';

import Table from 'react-bootstrap/lib/Table';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Pagination from 'react-bootstrap/lib/Pagination';

import uniqueId from 'lodash/uniqueId';
import isEmpty from 'lodash/isEmpty';
import result from 'lodash/result';
import toString from 'lodash/toString';
import compact from 'lodash/compact';

import { Product, AttributeType } from 'models';
import { SearchStore } from 'stores';

export default class ProductSearch extends Component {

  state = {
    preloading: false,
    searching: false,
    columns: `erp_id
erp_description
attributes.ansi_lumen
outlets.bisnl.attributes.description_html
outlets.bisnl.attributes.available_website
outlets.bisnl.attributes.picture`,
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

  performSearch(options = {}) {
    let { page = this.state.page } = options;

    this.setState({ searching: true, page: page });

    Product.search({
      query: this.state.query,
      page: page,
      searchId: this.searchId
    }).then(response => {
      if (response.ok) {
        this.setState({ searching: false });
      }
    })
  }

  handleColumnsChange = (e) => {
    this.setState({ columns: e.target.value });
  }

  handleQueryChange = (e) => {
    this.setState({ query: e.target.value });
  }

  handlePageChange = (event, selectedEvent) => {
    this.setState({ page: selectedEvent.eventKey }, this.performSearch);
  }

  handleSearch = () => {
    this.performSearch({ page: 1 })
  }

  renderPreloading() {
    return <h1>Preloading...</h1>
  }

  renderSearching() {
    return <h1>Searching...</h1> 
  }

  renderColumnHeader(columnPath, index) {
    return <th key={ index }>{ columnPath }</th>
  }
                
  renderColumnContents(product, columnPath, index) {
    let columnValue = result(product.toJson(), columnPath);
    return <td key={ index }>{ toString(columnValue) }</td>
  }

  renderProductRow(columns, product, index) {
    return (
      <tr key={ product.id }>
        <td>{ Product.perPage * (this.state.page - 1) + index + 1 }</td>
        { columns.map(this.renderColumnContents.bind(this, product)) }
      </tr>
    )
  }

  renderSearchResults() {
    let searchResults = SearchStore.get(this.searchId)

    if (!searchResults || isEmpty(searchResults.results)) {
      
      return <h1>Nothing found</h1>

    } else {
      let products = searchResults.results.map(id => Product.get(id))
      let columns = compact(this.state.columns.split("\n"));

      return (
        <div>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>#</th>
                { columns.map(this.renderColumnHeader) }
              </tr>
            </thead>
            <tbody>
              { products.map(this.renderProductRow.bind(this, columns)) }
            </tbody>
          </Table>

          <Pagination
            disabled
            bsSize="medium"
            items={ 10 /* Math.ceil(searchResults.total / Product.perPage) */ }
            activePage={ this.state.page }
            onSelect={ this.handlePageChange }
          />
        </div>
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
