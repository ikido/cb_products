'use strict';

import React, { PropTypes, Component } from 'react';
import Select from 'react-select';
import { SearchPreset } from 'models';
import { UIStore } from 'stores';
import { observer } from 'mobx-react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

@observer
export default class SearchPresetSelector extends Component {

  getOptions = () => {
    let presets = SearchPreset.all().slice().map(preset => {
      return { value: preset.id, label: preset.caption }
    });

    presets.unshift({ value: null, label: 'New preset'});
    return presets
  }

  handleChange = (item) => {
    if (!!item.value) {
      let preset = SearchPreset.get(item.value)

      UIStore.productSearch.selectedSearchPresetId = preset.id;
      UIStore.productSearch.queryCaption = preset.caption;
      UIStore.productSearch.query = preset.query;
    } else {
      UIStore.productSearch.selectedSearchPresetId = null;
      UIStore.productSearch.queryCaption = '';
      UIStore.productSearch.query = '';
    }    
  }

  render() {
    return (
      <Row className='margin-bottom'>
        <Col md={12}>
          <label className="control-label">
            <span>Select preset</span>
          </label>
          <Select
            placeholder='New preset'
            value={ UIStore.productSearch.selectedSearchPresetId }
            options={ this.getOptions() }
            onChange={ this.handleChange }
          />
        </Col>
      </Row>
    )    
  }

}