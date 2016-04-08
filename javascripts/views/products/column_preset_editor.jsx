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


export default class ColumnPresetEditor extends Component {
	static propTypes = {
		columns: PropTypes.string.isRequired,
		caption: PropTypes.string.isRequired,
		onCaptionChange: PropTypes.func.isRequired,
		onColumnsChange: PropTypes.func.isRequired,
		onSaveClick: PropTypes.func.isRequired
	};

	static defaultProps = {
		columns: '',
		caption: ''
	};

	state = {
		selectedAttributeTypeId: null
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
		let newValue = `\nattributes.${selectedAttributeType.name}, ${selectedAttributeType.caption}`;
		this.props.onChange(this.props.value+newValue);

		this.setState({ selectedAttributeTypeId: null });
	}

	handleColumnsChange = (e) => {
		this.props.onColumnsChange(e.target.value);
	}

	handleCaptionChange = (e) => {
		this.props.onCaptionChange(e.target.value);
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
							type="text"
							value={ this.props.caption }
							onChange={ this.handleCaptionChange }
							rows={10}
						/>
						<Input
							type="textarea"
							value={ this.props.columns }
							onChange={ this.handleColumnsChange }
							rows={10}
						/>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<Button bsStyle='success' onClick={ this.props.onSaveClick }>
							Save preset
						</Button>
					</Col>
				</Row>
			</div>
		)
	}
}