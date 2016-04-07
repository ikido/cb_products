import React, { PropTypes, Component } from 'react';
import Page from 'views/layout/page';

import Table from 'react-bootstrap/lib/Table';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Pagination from 'react-bootstrap/lib/Pagination';

import uniqueId from 'lodash/uniqueId';
import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';
import debounce from 'lodash/debounce';

import { Product, AttributeType } from 'models';
import { SearchStore } from 'stores';
import ColumnHeader from 'views/products/column_header';
import ProductRow from 'views/products/product_row';



export default class ProductSearch extends Component {

  state = {
    preloading: false,
    searching: false,
    searchError: false,
    columns: `erp_id,ERP ID
erp_description,Description
attributes.ansi_lumen,Lumen
outlets.bisnl.attributes.description_html.nl_NL,BISNL Html
outlets.bisnl.attributes.available_website,AW
outlets.bisnl.attributes.picture,BISNL Picture`,
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

    this.setState({
      searching: true,
      page: page,
      searchError: false
    });

    Product.search({
      query: this.state.query,
      page: page,
      searchId: this.searchId
    }).then(response => {
      if (response.ok) {
        this.setState({ searching: false, searchError: false });
      } else {
        this.setState({ searching: false, searchError: true });
      }
    })
  }

  getColumns() {
    let columns = []

    this.state.columns.split("\n").forEach(column => {
      let [path, header] = column.split(',')
      if (!isEmpty(path.trim())) {
        columns.push({ path, header })
      }
    })

    return columns;
  }

  handleColumnsChange = (e) => {
    this.setState({ columns: e.target.value });
  }

  handleQueryChange = (e) => {
    this.debouncedCallback ? this.debouncedCallback.cancel() : void(0);

    this.debouncedCallback = debounce(() => {
      this.performSearch({ page: 1 });
    }, 750);

    this.setState({ query: e.target.value }, this.debouncedCallback);
  }

  handlePageChange = (event, selectedEvent) => {
    this.setState({ page: selectedEvent.eventKey }, this.performSearch);
  }

  renderPreloading() {
    return <h1>Preloading...</h1>
  }

  renderSearching() {
    return <h1>Searching...</h1> 
  }

  renderSearchResults() {

    if (this.state.searchError) {
      return <h1>Error occured</h1>
    }

    let searchResults = SearchStore.get(this.searchId)

    if (!searchResults || isEmpty(searchResults.results)) {
      
      return <h1>Nothing found</h1>

    } else {
      let products = searchResults.results.map(id => Product.get(id));
      let columns = this.getColumns();
      let totalPages = Math.ceil(searchResults.total / Product.perPage)

      return (
        <div>
          <Pagination
            disabled
            bsSize="medium"
            items={ totalPages }
            activePage={ this.state.page }
            onSelect={ this.handlePageChange }
          />

          <Table bordered responsive>
            <thead>
              <tr>
                <th>#</th>
                { columns.map((column, index) => 
                  <ColumnHeader key={ index } column={ column } />
                )}
              </tr>
            </thead>
            <tbody>
              { products.map((product, index) => 
                <ProductRow
                  key={ product.id }
                  product={ product }
                  columns={ columns }
                  index={ Product.perPage * (this.state.page - 1) + index + 1 }
                />
              )}
            </tbody>
          </Table>

          <Pagination
            disabled
            bsSize="medium"
            items={ totalPages }
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
