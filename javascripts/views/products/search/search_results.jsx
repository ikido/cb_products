import React, { PropTypes, Component } from 'react';
import { SearchStore, UIStore } from 'stores';
import { Product } from 'models';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';

import Pagination from 'react-bootstrap/lib/Pagination';
import Table from 'react-bootstrap/lib/Table';

import ColumnHeader from 'views/products/search/column_header';
import ProductRow from 'views/products/search/product_row';

import isEmpty from 'lodash/isEmpty';

@observer
export default class ProductSearchResults extends Component {

  componentWillMount() {
    UIStore.productSearch.startAutoSearch();
  }

  componentWillUnmount() {
    UIStore.productSearch.stopAutoSearch();
  }  

  handlePageChange = (event, selectedEvent) => {
    // this.setState({ searching: true })
    UIStore.productSearch.setPage(selectedEvent.eventKey)
  }

  renderSearchResults(searchResults) {
    const ui = UIStore.productSearch;

    let columns = ui.getPreparedColumns();

    // searchResults contain only product ids, we need product instances
    let products = searchResults.results.map(id => Product.get(id));

    // searchResults contain total number of products
    let totalPages = Math.ceil(searchResults.total / Product.perPage)

    return (
      <div>
        <Pagination
          disabled
          bsSize="medium"
          items={ totalPages }
          activePage={ ui.page }
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
                index={ Product.perPage * (ui.page - 1) + index + 1 }
              />
            )}
          </tbody>
        </Table>

        <Pagination
          disabled
          bsSize="medium"
          items={ totalPages }
          activePage={ ui.page }
          onSelect={ this.handlePageChange }
        />
      </div>
    )
  }

  render() {
    const ui = UIStore.productSearch;
    const searchResults = ui.getSearchResults();
    
    let message = '';

    if (isEmpty(ui.query)) {
      message = 'Empty query';
    }

    if (ui.searching) {
      message = 'Searching...';
    }

    if (ui.searchError) {
      message = 'Error occured';
    }

    if (!message && (!searchResults || isEmpty(searchResults.results))) {      
      message = 'Nothing found';
    }

    return !isEmpty(message) ? <h1>{ message }</h1> : this.renderSearchResults(searchResults);
  }
}