import React, { PropTypes, Component } from 'react';
import { SearchStore, UIStore } from 'stores';
import { Product } from 'models';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';

import Pagination from 'react-bootstrap/lib/Pagination';
import Table from 'react-bootstrap/lib/Table';

import ColumnHeader from 'views/products/search/column_header';
import ProductRow from 'views/products/search/product_row';

import uniqueId from 'lodash/uniqueId';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';

@observer
export default class ProductSearchResults extends Component {

  state = {
    searching: false,
    searchError: false
  }

  searchId = uniqueId('product_search_');    

  componentWillMount() {
    // debounced search for query that changes too fast
    let debouncedSearch = debounce(this.performSearch, 750);

    /*
     * whenever UIStore.productSearch.query or UIStore.productSearch.page changes 
     * callback passed to autorun will be called, performing search with given 
     * query and page
     */
    this.disposeSearch = autorun(() => {
      let action;

      // if page have changed we can fire action right away
      if (this.previousPage !== UIStore.productSearch.page) {
        action = this.performSearch; 

      // otherwise we have to debounce it
      } else {
        action = debouncedSearch;
      }

      /*
       * arguments to debouncedSearch will be
       * passed to performSearch. We need to explicitly
       * access observable properties inside autorun
       * for it to be called when they change
       */
      action({ 
        query: UIStore.productSearch.query,
        page: UIStore.productSearch.page
      })

      // save  page for next call
      this.previousPage = UIStore.productSearch.page;
    });
  }

  componentWillUnmount() {
    /* 
     * mobx autorun method return a function to dispose search,
     * we should do that when component is going to unmount
     */
    this.disposeSearch();
  }

  /*
   * Method to actually perform the search
   * We want it in a component to display loading
   * spinners and errors, if any
   */
  performSearch = (options = {}) => {
    let { query, page } = options;

    if (isEmpty(query)) return;

    this.setState({
      searching: true,
      searchError: false
    });

    /*
     * We use 'search' action in product model that
     * makes API request and returns promise
     */ 
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


  // prepare columns for components
  getPreparedColumns() {
    let columns = [];

    UIStore.productSearch.columns.split("\n").forEach(column => {
      let [path, header] = column.split(',')
      if (!isEmpty(path.trim())) {
        columns.push({ path, header })
      }
    })

    return columns;
  }

  handlePageChange = (event, selectedEvent) => {
    // this.setState({ searching: true })
    UIStore.productSearch.setPage(selectedEvent.eventKey)
  }

  renderSearchResults(searchResults) {
    let columns = this.getPreparedColumns();

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
                index={ Product.perPage * (this.state.page - 1) + index + 1 }
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
    // subscribe to observable data
    let searchResults = SearchStore.get(this.searchId)
    
    let message = '';

    if (isEmpty(UIStore.productSearch.query)) {
      message = 'Empty query';
    }

    if (this.state.searching) {
      message = 'Searching...';
    }

    if (this.state.searchError) {
      message = 'Error occured';
    }

    if (!searchResults || isEmpty(searchResults.results)) {      
      message = 'Nothing found';
    }

    return !isEmpty(message) ? <h1>{ message }</h1> : this.renderSearchResults(searchResults);
  }
}