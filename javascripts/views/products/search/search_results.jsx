import React, { PropTypes, Component } from 'react';
import { UIStore } from 'stores';
import { Product } from 'models';
import { observer } from 'mobx-react';

import Pagination from 'react-bootstrap/lib/Pagination';
import Table from 'react-bootstrap/lib/Table';

import ColumnHeader from 'views/products/search/column_header';
import ProductRow from 'views/products/search/product_row';

import isEmpty from 'lodash/isEmpty';

@observer
export default class ProductSearchResults extends Component {   

  componentWillMount() {
    // calls mobx autorun for query and page
    UIStore.productSearch.startAutoSearch()
  }

  componentWillUnmount() {
    // calls mobx autoran dispose function
    UIStore.productSearch.stopAutoSearch() 
  }

  handlePageChange = (event, selectedEvent) => {
    UIStore.productSearch.setPage(selectedEvent.eventKey)
  }

  renderSearchResults(searchResults) {
    let columns = UIStore.productSearch.getPreparedColumns();

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
          activePage={ UIStore.productSearch.page }
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
                index={ Product.perPage * (UIStore.productSearch.page - 1) + index + 1 }
              />
            )}
          </tbody>
        </Table>

        <Pagination
          disabled
          bsSize="medium"
          items={ totalPages }
          activePage={ UIStore.productSearch.page }
          onSelect={ this.handlePageChange }
        />
      </div>
    )
  }

  render() {
    let searchUI = UIStore.productSearch

    // subscribe to observable data
    let searchResults = searchUI.getSearchResults()
    
    let message = '';

    if (isEmpty(searchUI.query)) {
      message = 'Empty query';
    }

    if (searchUI.searching) {
      message = 'Searching...';
    }

    if (searchUI.searchError) {
      message = 'Error occured';
    }

    if (!searchResults || isEmpty(searchResults.results)) {      
      message = 'Nothing found';
    }

    return !isEmpty(message) ? <h1>{ message }</h1> : this.renderSearchResults(searchResults);
  }
}