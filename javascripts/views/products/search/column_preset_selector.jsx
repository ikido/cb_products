'use strict';

import React, { PropTypes, Component } from 'react';
import Select from 'react-select';
import { ColumnPreset } from 'models';
import { UIStore } from 'stores';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

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
    return  ColumnPreset.all().slice().map(preset => {
      return { value: preset.id, label: preset.caption }
    });
  }

  handleChange = (item) => {
    if (item && !!item.value) {
      UIStore.productSearch.selectedColumnPresetId = item.value;
      UIStore.productSearch.showColumnsEditor = false;
    } else {
      UIStore.productSearch.selectedColumnPresetId = null;
    }   
  }

  handleEditPreset = () => {
    UIStore.productSearch.showColumnsEditor = true
  }

  handleNewPreset = () => {
    UIStore.productSearch.showColumnsEditor = true
    UIStore.productSearch.columnsCaption = '';
    UIStore.productSearch.columns = '';
    UIStore.productSearch.selectedColumnPresetId = null;
  }


  render() {
    return (
      <Row className='margin-bottom'>
        <Col md={10}>
          <label className="control-label">
            <span>Select preset</span>
          </label>
          <Select
            value={ UIStore.productSearch.selectedColumnPresetId }
            options={ this.getOptions() }
            onChange={ this.handleChange }
          />
          
        </Col>
        <Col md={2} className='preset-buttons'>
          { UIStore.productSearch.selectedColumnPresetId ? <Button onClick={ this.handleEditPreset }>Edit</Button> : '' }
          
          &nbsp;
          <Button onClick={ this.handleNewPreset }>New</Button>
        </Col>
      </Row>
    )    
  }

}