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
  
  * Each paramName must be unique

  * precedeWith should be valid ElasticSearch prefix, like AND or OR (lowercased)

  * if input field is empty userParam is not included in search query, as well as prefix (and, or)

  * if query is edited search input value is reset

 */

@observer
export default class SearchParams extends Component {

  onInputChange(param, e) {
    UIStore.productSearch.setUserParam(param.name, e.target.value)
  }

  render() {
    return (
      <Row>
        { UIStore.productSearch.userParams.slice().reverse().map((p,i) =>
          <Col md={2} className='product-user-search-params' key={p.name}>
            <Input
              value={ p.value }
              type="text"
              placeholder={ titleize(p.name) }
              onChange={ this.onInputChange.bind(this, p) }
            />
          </Col>
        )}
      </Row>
    )    
  }

}