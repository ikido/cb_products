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

  getColumnPresetOptions = () => {
    return ColumnPreset.all().slice().map(preset => {
      return { value: preset.id, label: preset.caption }
    })
  }

  handlePresetChange = (selectedItem) => {
    let preset = ColumnPreset.get(selectedItem.value)

    UIStore.productSearch.selectedColumnPresetId = preset.id;
    UIStore.productSearch.columnsCaption = preset.caption;
    UIStore.productSearch.columns = preset.columns;
  }

  render() {
    return (
      <Row className='margin-bottom'>
        <Col md={12}>
          <label className="control-label">
            <span>Select preset</span>
          </label>
          <Select
            value={ UIStore.productSearch.selectedColumnPresetId }
            options={ this.getColumnPresetOptions() }
            onChange={ this.handlePresetChange }
          />
        </Col>
      </Row>
    )    
  }

}