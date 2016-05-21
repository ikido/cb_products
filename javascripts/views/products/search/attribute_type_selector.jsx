import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';

import Select from 'react-select';

import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { AttributeType } from 'models';

import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';

import { UIStore } from 'stores';

@observer
export default class AttributeTypeSelector extends Component {

  static propTypes = {
    disabled: PropTypes.bool
  }

  state = {
    selectedAttributeTypeId: null
  }

  getAttributeTypeOptions() {
    return AttributeType.all().slice().map(attributeType => {
      return { value: attributeType.id, label: attributeType.caption }
    });
  }

  handleAttributeTypeSelectChange = (selectedItem) => {
    let newValue = isObject(selectedItem) ? selectedItem.value : '';
    this.setState({ selectedAttributeTypeId: newValue });
  }

  addAttributeType = () => {
    let searchUI = UIStore.productSearch;

    let selectedAttributeType = AttributeType.get(this.state.selectedAttributeTypeId);
    let caption = selectedAttributeType.caption.replace(/,/g, '');

    let newValue = `\nattributes.${selectedAttributeType.name}, ${caption}`;
    
    // here we actually add selected attribute to preset's columns
    searchUI.setColumns(searchUI.columns+newValue);

    this.setState({ selectedAttributeTypeId: null });
  }

  render() {
    return (
      <Row style={{ marginBottom: '18px' }}>
        <Col md={4}>
          <label className="control-label">
            <span>Add attribute</span>
          </label>
          <Select
            value={ this.state.selectedAttributeTypeId }
            options={ this.getAttributeTypeOptions() }
            onChange={ this.handleAttributeTypeSelectChange }
            disabled={ this.props.disabled }
          />
        </Col>
        <Col md={4}>
          <Button bsStyle='success' onClick={ this.addAttributeType }  style={{ marginTop: '24px' }} disabled={ this.props.disabled }>
            Add
          </Button>
        </Col>
      </Row>
    )
  }
}
