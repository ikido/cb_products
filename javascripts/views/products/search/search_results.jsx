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
import uniqueId from 'lodash/uniqueId';
import debounce from 'lodash/debounce';

@observer
export default class ProductSearchResults extends Component {

  state = {
    page: 1,
    searching: false,
    searchError: false
  }

  searchId = uniqueId('product_search_');    

  componentWillMount() {
    let debouncedSearch = debounce(this.performSearch, 750);

    /*
     * whenever UIStore.productSearch.query changes callback passed to
     * autorun will be called, performing search with given query and getting first page
     */
    autorun(() => {
      debouncedSearch({ query: UIStore.productSearch.query, page: 1 });
    });
  }

  getColumns() {
    let columns = []

    UIStore.productSearch.columns.split("\n").forEach(column => {
      let [path, header] = column.split(',')
      if (!isEmpty(path.trim())) {
        columns.push({ path, header })
      }
    })

    return columns;
  }

  performSearch = (options = {}) => {
    let {
      page = this.state.page,
      query = UIStore.productSearch.query
    } = options;    

    if (isEmpty(query)) return;

    this.setState({
      searching: true,
      page: page,
      searchError: false
    });

    Product.search({
      query,
      page,
      searchId: this.searchId
    }).then(response => {
      if (response.ok) {
        this.setState({ searching: false, searchError: false });
      } else {
        this.setState({ searching: false, searchError: true });
      }
    })
  }

  handlePageChange = (event, selectedEvent) => {
    this.setState({ page: selectedEvent.eventKey }, this.performSearch);
  }

  render() {
    // subscribe to observable data
    let searchResults = SearchStore.get(this.searchId)
    let columns = this.getColumns();
    let message = '';

    if (isEmpty(UIStore.productSearch.query)) {
      message = <h1>Empty query</h1>
    }

    if (this.state.searching) {
      message = <h1>Searching...</h1>
    }

    if (this.state.searchError) {
      message = <h1>Error occured</h1>
    }

    if (!searchResults || isEmpty(searchResults.results)) {      
      message = <h1>Nothing found</h1>
    }

    if (!isEmpty(message)) return message

    let products = searchResults.results.map(id => Product.get(id));
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