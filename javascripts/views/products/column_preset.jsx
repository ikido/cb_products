'use strict';

import React, { PropTypes, Component } from 'react';
import Select from 'react-select';
import { AttributeType } from 'models';
import { observer } from 'mobx-react';
import isObject from 'lodash/isObject';

import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';


export default class ColumnPreset extends Component {
	static propTypes = {
		value: PropTypes.string.isRequired,
		onChange: PropTypes.func
	};

	static defaultProps = {
		value: ''
	};

	state = {
		selectedAttributeTypeName: ''
	};

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
		let selectedAttributeType = AttributeType.get(this.state.selectedAttributeTypeId);
		let newValue = this.props.value + `\nattributes.${selectedAttributeType.name}`;
		this.props.onChange(newValue);

		this.setState({ selectedAttributeTypeId: '' });
	}

	handleInputChange = (e) => {
		this.props.onChange(e.target.value);
	}

	render() {
		return (
			<div>
				<Row>
					<Col md={8}>
						<Select
							value={ this.state.selectedAttributeTypeId }
							options={ this.getAttributeTypeOptions() }
							onChange={ this.handleAttributeTypeSelectChange }
						/>
					</Col>
					<Col md={4}>
						<Button bsStyle='success' onClick={ this.addAttributeType }>
							Add
						</Button>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<Input
							type="textarea"
							value={ this.props.value }
							onChange={ this.handleInputChange }
							rows={10}
						/>
					</Col>
				</Row>
			</div>
		)
	}
}