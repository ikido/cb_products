'use strict';

import React, { PropTypes, Component } from 'react';
import Select from 'react-select';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

export default class PresetSelector extends Component {

  static propTypes = {
    selectedPresetId: PropTypes.number,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelectedPresetChange: PropTypes.func.isRequired,
    onShowEditorClick: PropTypes.func.isRequired,
    onNewPresetClick: PropTypes.func.isRequired
  }

  render() {
    return (
      <Row className='margin-bottom'>
        <Col md={9}>
          <label className="control-label">
            <span>Select preset</span>
          </label>
          <Select
            value={ this.props.selectedPresetId }
            options={ this.props.options }
            onChange={ this.props.onSelectedPresetChange }
          />
        </Col>
        <Col md={3} className='preset-buttons'>
          { this.props.selectedPresetId ? <Button onClick={ this.props.onShowEditorClick }>Edit</Button> : '' }
          
          &nbsp;
          <Button onClick={ this.props.onNewPresetClick }>New</Button>
        </Col>
      </Row>
    )    
  }

}