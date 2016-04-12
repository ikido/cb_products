'use strict';

import React, { PropTypes, Component } from 'react';
import Select from 'react-select';
import { SearchPreset } from 'models';
import { UIStore } from 'stores';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

const NewPresetName = '[ Create new preset ]';

@observer
export default class SearchPresetSelector extends Component {

  componentWillMount() {
    autorun(() => {
      let presetId, preset;

      presetId = UIStore.productSearch.selectedSearchPresetId;

      if (!!presetId) preset = SearchPreset.get(presetId);

      if (!!preset) {            
        UIStore.productSearch.queryCaption = preset.caption;
        UIStore.productSearch.query = preset.query;
      } else {
        UIStore.productSearch.queryCaption = '';
        UIStore.productSearch.query = '';
      }      
    });
  }

  getOptions = () => {
    let presets = SearchPreset.all().slice().map(preset => {
      return { value: preset.id, label: preset.caption }
    });

    presets.unshift({ value: null, label: NewPresetName });
    return presets
  }

  handleChange = (item) => {
    if (item && !!item.value) {
      UIStore.productSearch.selectedSearchPresetId = item.value;
    } else {
      UIStore.productSearch.selectedSearchPresetId = null;
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
            value={ UIStore.productSearch.selectedSearchPresetId }
            options={ this.getOptions() }
            onChange={ this.handleChange }
          />
        </Col>
      </Row>
    )    
  }

}