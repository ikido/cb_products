'use strict';

import React, { PropTypes, Component } from 'react';
import Select from 'react-select';
import { ColumnPreset } from 'models';
import { UIStore } from 'stores';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

const NewPresetName = '[ Create new preset ]';

@observer
export default class ColumnPresetSelector extends Component {

  componentWillMount() {
    autorun(() => {
      let presetId, preset;

      presetId = UIStore.productSearch.selectedColumnPresetId;

      if (!!presetId) preset = ColumnPreset.get(presetId);

      if (!!preset) {            
        UIStore.productSearch.columnsCaption = preset.caption;
        UIStore.productSearch.columns = preset.columns;
      } else {
        UIStore.productSearch.columnsCaption = '';
        UIStore.productSearch.columns = '';
      }      
    });
  }

  getOptions = () => {
    let presets = ColumnPreset.all().slice().map(preset => {
      return { value: preset.id, label: preset.caption }
    });

    presets.unshift({ value: null, label: NewPresetName });
    return presets
  }

  handleChange = (item) => {
    if (item && !!item.value) {
      UIStore.productSearch.selectedColumnPresetId = item.value;
    } else {
      UIStore.productSearch.selectedColumnPresetId = null;
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
            placeholder={ NewPresetName }
            value={ UIStore.productSearch.selectedColumnPresetId }
            options={ this.getOptions() }
            onChange={ this.handleChange }
          />
        </Col>
      </Row>
    )    
  }

}