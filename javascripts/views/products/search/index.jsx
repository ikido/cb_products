'use strict';

import React, { PropTypes, Component } from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';

import { Product, AttributeType, ColumnPreset } from 'models';

import Page from 'views/layout/page';
import ColumnPresetSelector from 'views/products/search/column_preset_selector';
import ColumnPresetEditor from 'views/products/search/column_preset_editor';
import QueryPresetEditor from 'views/products/search/query_preset_editor';
import SearchResults from 'views/products/search/search_results';

import './style'

export default class ProductSearch extends Component {

  state = {
    preloading: false
  };

  componentWillMount() {
    this.setState({ preloading: true });
    
    Promise.all([
      AttributeType.loadAll(),
      ColumnPreset.loadAll()
    ]).then(responses => {
      this.setState({ preloading: false });
    });
  }

  renderSearch() {
    return (
      <div>
        <Row>
          <Col md={6}>
            <ColumnPresetSelector />
            <ColumnPresetEditor />
          </Col>
          <Col md={6}>
            <QueryPresetEditor />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <SearchResults />
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
        { this.state.preloading ? <h1>Preloading...</h1> : this.renderSearch() }
      </Page>
    )
  }
}
