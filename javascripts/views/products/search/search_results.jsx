import React, { PropTypes, Component } from 'react';
import { SearchStore, UIStore } from 'stores';
import { Product } from 'models';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import Select from 'react-select';

import Pagination from 'react-bootstrap/lib/Pagination';
import Table from 'react-bootstrap/lib/Table';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

import ColumnHeader from 'views/products/search/column_header';
import ProductRow from 'views/products/search/product_row';
import LoadingOverlay from 'views/shared/loading_overlay';

import isEmpty from 'lodash/isEmpty';
import { openPath } from 'lib/utils';

const ui = UIStore.productSearch;

const perPageOptions = [20, 50, 100, 500].map(v => {
  return { value: v, label: v }
});

@observer
export default class ProductSearchResults extends Component {

  componentWillMount() {
    ui.startAutoSearch();
  }

  componentWillUnmount() {
    ui.stopAutoSearch();
  }  

  handlePageChange = (event, selectedEvent) => {
    // this.setState({ searching: true })
    ui.setPage(selectedEvent.eventKey)
  }

  handleExportClick = () => {
    openPath(`/products/export?es_query=${ui.query}&columns=${ui.columns}`)
  }

  handlePerPageChange = (item) => {
    console.log(item.value)
    ui.setPerPage(item.value)
  }

  renderSearchResults(searchResults) {
    const columns = ui.getPreparedColumns();

    // searchResults contain only product ids, we need product instances
    const products = searchResults.results.map(id => Product.get(id));

    // searchResults contain total number of products
    const totalPages = Math.ceil(searchResults.total / ui.perPage)    

    return (
      <div>
        <Row>          
          <Col md={9}>
            <Pagination
              first
              last
              next
              prev
              boundaryLinks
              maxButtons={ 10 }
              bsSize="medium"
              items={ totalPages }
              activePage={ ui.page }
              onSelect={ this.handlePageChange }
            />
          </Col>
          <Col md={2} className='export-container'>
            <Button bsStyle="success" onClick={ this.handleExportClick }>Export results</Button>
          </Col>
          <Col md={1} className='per-page-container'>
            <Select
              searchable={ false }
              clearable={ false }
              value={ ui.perPage }
              options={ perPageOptions }
              onChange={ this.handlePerPageChange }
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <LoadingOverlay visible={ ui.searching }>
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
                      index={ ui.perPage * (searchResults.page - 1) + index + 1 }
                    />
                  )}
                </tbody>
              </Table>
            </LoadingOverlay>
          </Col>
        </Row>
        <Row>
          <Col md={10}>
            <Pagination
              first
              last
              next
              prev
              boundaryLinks
              maxButtons={ 10 }
              bsSize="medium"
              items={ totalPages }
              activePage={ ui.page }
              onSelect={ this.handlePageChange }
            />
          </Col>
          <Col md={2} className='per-page-container'>
            <Select
              searchable={ false }
              clearable={ false }
              value={ ui.perPage }
              options={ perPageOptions }
              onChange={ this.handlePerPageChange }
            />
          </Col>
        </Row>
      </div>
    )
  }

  render() {
    const searchResults = ui.getSearchResults();
    
    let message = '';

    if (ui.searchError) return <h1>An error occured</h1>;

    if (!!searchResults) {

      if (isEmpty(searchResults.results)) {      
        return <h1>Nothing found</h1>
      } else {
        return this.renderSearchResults(searchResults);
      }
    } else {
      return null;
    }    
  }
}