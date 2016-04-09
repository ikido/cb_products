'use strict';

import React, { PropTypes, Component } from 'react';
import Select from 'react-select';
import { ColumnPreset } from 'models';
import { UIStore } from 'stores';
import { observer } from 'mobx-react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

@observer
export default class ColumnPresetSelector extends Component {

  getOptions = () => {
    let presets = ColumnPreset.all().slice().map(preset => {
      return { value: preset.id, label: preset.caption }
    });

    presets.unshift({ value: null, label: 'New preset'});
    return presets
  }

  handleChange = (item) => {
    if (item && !!item.value) {
      let preset = ColumnPreset.get(item.value)

      UIStore.productSearch.selectedColumnPresetId = preset.id;
      UIStore.productSearch.columnsCaption = preset.caption;
      UIStore.productSearch.columns = preset.columns;
    } else {
      UIStore.productSearch.selectedColumnPresetId = null;
      UIStore.productSearch.columnsCaption = '';
      UIStore.productSearch.columns = '';
    }    
  }

  render() {
    console.log('rendered ColumnPresetSelector')
    return (
      <Row className='margin-bottom'>
        <Col md={12}>
          <label className="control-label">
            <span>Select preset</span>
          </label>
          <Select
            placeholder='New preset'
            value={ UIStore.productSearch.selectedColumnPresetId }
            options={ this.getOptions() }
            onChange={ this.handleChange }
          />
        </Col>
      </Row>
    )    
  }

}