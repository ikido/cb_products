import React, { PropTypes, Component } from 'react';
import { SearchStore, UIStore } from 'stores';
import { Product } from 'models';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';

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

  renderSearchResults(searchResults) {
    const columns = ui.getPreparedColumns();

    // searchResults contain only product ids, we need product instances
    const products = searchResults.results.map(id => Product.get(id));

    // searchResults contain total number of products
    const totalPages = Math.ceil(searchResults.total / Product.perPage)    

    return (
      <div>
        <Row>
          <Col md={10}>
            <Pagination
              disabled
              bsSize="medium"
              items={ totalPages }
              activePage={ ui.page }
              onSelect={ this.handlePageChange }
            />
          </Col>
          <Col md={2} className='export-container'>
            <Button bsStyle="success" onClick={ this.handleExportClick }>Export results</Button>
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
                      index={ Product.perPage * (ui.page - 1) + index + 1 }
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
              disabled
              bsSize="medium"
              items={ totalPages }
              activePage={ ui.page }
              onSelect={ this.handlePageChange }
            />
          </Col>
        </Row>
      </div>
    )
  }

  render() {
    const searchResults = ui.getSearchResults();
    
    let message = '';

    if (isEmpty(ui.query)) message = 'Empty query';

    if (ui.searchError) message = 'An error occured';

    if (!message && (!searchResults || isEmpty(searchResults.results))) {      
      message = 'Nothing found';
    }

    return !isEmpty(message) ? <h1>{ message }</h1> : this.renderSearchResults(searchResults);
  }
}