'use strict';

import React, { PropTypes, Component } from 'react';
import Select from 'react-select';
import { AttributeType } from 'models';
import Input from 'react-bootstrap/lib/Input';

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
			return { value: attributeType.name, label: attributeType.caption }
		});
	}

	logChange(...args) {
		console.log('selected', args)
	}

	render() {
		return (
			<div>
				<Select
					value={ this.state.selectedAttributeTypeName }
					options={ this.getAttributeTypeOptions() }
					onChange={ this.logChange }
				/>
				<Input
					type="textarea"
					label="Columns"
					value={ this.props.value }
					onChange={ this.props.onChange }
					rows={10}
				/>
			</div>
		)
	}
}