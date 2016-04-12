'use strict';

import React, { PropTypes, Component } from 'react';
import Select from 'react-select';
import { SearchPreset } from 'models';
import { UIStore } from 'stores';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

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
    return SearchPreset.all().slice().map(preset => {
      return { value: preset.id, label: preset.caption }
    });
  }

  handleChange = (item) => {
    if (item && !!item.value) {
      UIStore.productSearch.selectedSearchPresetId = item.value;
      UIStore.productSearch.showSearchEditor = false;
    } else {
      UIStore.productSearch.selectedSearchPresetId = null;
    }   
  }

  handleEditPreset = () => {
    UIStore.productSearch.showSearchEditor = true
  }

  handleNewPreset = () => {
    UIStore.productSearch.showSearchEditor = true
    UIStore.productSearch.queryCaption = '';
    UIStore.productSearch.query = '';
    UIStore.productSearch.selectedSearchPresetId = null;
  }

  render() {
    return (
      <Row className='margin-bottom'>
        <Col md={10}>
          <label className="control-label">
            <span>Select preset</span>
          </label>
          <Select
            value={ UIStore.productSearch.selectedSearchPresetId }
            options={ this.getOptions() }
            onChange={ this.handleChange }
          />
        </Col>
        <Col md={2} className='preset-buttons'>
          { UIStore.productSearch.selectedSearchPresetId ? <Button onClick={ this.handleEditPreset }>Edit</Button> : '' }
          
          &nbsp;
          <Button onClick={ this.handleNewPreset }>New</Button>
        </Col>
      </Row>
    )    
  }

}