'use strict';

import React, { PropTypes, Component } from 'react';
import { UIStore } from 'stores';
import { observer } from 'mobx-react';
import { titleize } from 'inflection';

import Input from 'react-bootstrap/lib/Input';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import './search_params.css';

/*
  
  * Params should be defined as {paramName:precedeWith} or just {paramName}

  * precedeWith should be valid ElasticSearch prefix, like AND or OR (lowercased)

  * paramName will be used as placeholder

  * if input field is empty userParam is not included in search query, as well as prefix (and, or)

  * if query is edited search input value is reset

  * you can even use just {} and skip placehholder, 'param N' placeholder will be used instead

 */

@observer
export default class SearchParams extends Component {

  onInputChange(param, e) {
    UIStore.productSearch.setUserParam(param.id, e.target.value)
  }

  render() {
    return (
      <Row>
        { UIStore.productSearch.userParams.slice().reverse().map(p =>
          <Col md={2} className='product-user-search-params' key={p.id}>
            <Input
              value={ p.value }
              type="text"
              placeholder={ p.name ? titleize(p.name) : `param ${p.id + 1}` }
              onChange={ this.onInputChange.bind(this, p) }
            />
          </Col>
        )}
      </Row>
    )    
  }

}