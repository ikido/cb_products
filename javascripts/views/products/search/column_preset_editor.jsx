'use strict';

import React, { PropTypes, Component } from 'react';
import Select from 'react-select';
import { AttributeType, ColumnPreset } from 'models';
import { observer } from 'mobx-react';

import { UIStore } from 'stores';

import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';

import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Well from 'react-bootstrap/lib/Well';

@observer
export default class ColumnPresetEditor extends Component {

	state = {
		selectedAttributeTypeId: null
	};

	getAttributeTypeOptions() {
		return AttributeType.all().slice().map(attributeType => {
			return { value: attributeType.id, label: attributeType.caption }
		});
	}

	addAttributeType = () => {
		let selectedAttributeType = AttributeType.get(this.state.selectedAttributeTypeId);
		let caption = selectedAttributeType.caption.replace(/,/g, '');

		let newValue = `\nattributes.${selectedAttributeType.name}, ${caption}`;
		UIStore.productSearch.columns = UIStore.productSearch.columns+newValue;

		this.setState({ selectedAttributeTypeId: null });
	}

	savePreset = () => {
		let caption = UIStore.productSearch.columnsCaption;
		let columns = UIStore.productSearch.columns;

    if (isEmpty(columns) || isEmpty(caption)) {
      alert("Column preset must have caption and columns");
      return
    }

    ColumnPreset.createProductPreset({ caption, columns })
  }

 	handleAttributeTypeSelectChange = (selectedItem) => {
		let newValue = isObject(selectedItem) ? selectedItem.value : '';
		this.setState({ selectedAttributeTypeId: newValue });
	}

  handleCaptionChange = (e) => {
  	UIStore.productSearch.columnsCaption = e.target.value;
  }

	handleColumnsChange = (e) => {
    UIStore.productSearch.columns = e.target.value;
  }

	render() {
		return (
			<Well>
				<Row className='margin-bottom'>
					<Col md={4}>
						<label className="control-label">
							<span>Add attribute</span>
						</label>
						<Select
							value={ this.state.selectedAttributeTypeId }
							options={ this.getAttributeTypeOptions() }
							onChange={ this.handleAttributeTypeSelectChange }
						/>
					</Col>
					<Col md={4}>
						<Button bsStyle='success' onClick={ this.addAttributeType }  style={{ marginTop: '24px' }}>
							Add
						</Button>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<Input
							label="Caption"
							type="text"
							value={ UIStore.productSearch.columnsCaption }
							onChange={ this.handleCaptionChange }
						/>
						<Input
							label="Columns"
							type="textarea"
							value={ UIStore.productSearch.columns }
							onChange={ this.handleColumnsChange }
							rows={10}
						/>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<Button bsStyle='success' onClick={ this.savePreset }>
							{ !!UIStore.productSearch.selectedColumnPresetId ? 'Save preset' : 'Create preset' }
						</Button>
					</Col>
				</Row>
			</Well>
		)
	}
}