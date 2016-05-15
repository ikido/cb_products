import React, { PropTypes, Component } from 'react';
import isEmpty from 'lodash/isEmpty';
import { titleize, underscore } from 'inflection';

import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Well from 'react-bootstrap/lib/Well';

import SpinnerIcon from 'views/shared/spinner_icon';

import { UIStore } from 'stores';

export default class PresetEditor extends Component {

	static propTypes = {
		caption: PropTypes.string.isRequired,
		content: PropTypes.string.isRequired,

		onCaptionChange: PropTypes.func.isRequired,
		onContentChange: PropTypes.func.isRequired,

		presetClass: PropTypes.func.isRequired,
		selectedPresetId: PropTypes.number,

		setSelectedPresetId: PropTypes.func.isRequired,
		onCancelClick: PropTypes.func.isRequired,
	}

	state = {
		saving: false,
		deleting: false
	}

	getPreset() {
		return !!this.props.selectedPresetId && this.props.presetClass.get(this.props.selectedPresetId)
	}

	getContentAttributeName() {
		// what attribute name we should use to save preset contents
    return this.props.presetClass.name === 'SearchPreset' ? 'query' : 'columns';
	}

	isNew() {
		return !this.getPreset();
	}

	handleCaptionChange = (e) => {
		this.props.onCaptionChange(e.target.value);
	}

	handleContentChange = (e) => {
		this.props.onContentChange(e.target.value);	
	}

	handleSaveClick = () => {
    if (isEmpty(this.props.content) || isEmpty(this.props.caption)) {
      UIStore.notification.error('Preset must have caption and contents');
      return
    }

    let preset = this.getPreset();

    // which model action to use
    let action  = !!preset ? preset.update : this.props.presetClass.createProductPreset;    

    this.setState({ saving: true });

    // finally, send an action
    action({
    	caption: this.props.caption,
    	[this.getContentAttributeName()]: this.props.content
    }).then(response => {
    	this.setState({ saving: false });

    	if (response.ok) {
    		UIStore.notification.success('Preset saved')
    		if (this.isNew()) this.props.setSelectedPresetId(response.body.id);
    	} else {
    		UIStore.notification.errors(response.body.caption)
    	}
    });
  }

  handelDeleteClick = () => {
		this.setState({ deleting: true });

    this.getPreset().destroy().then(response => {
    	this.setState({ deleting: false });

    	if (response.ok) {
    		UIStore.notification.success('Preset deleted')
    		this.props.setSelectedPresetId(null)
    	} else {
    		UIStore.notification.errors(response.body.caption)
    	}
    });
	}

	uiIsDisabled() {
		return (this.state.saving || this.state.deleting);
	}

	renderSaveButtonText() {
  	let text = this.isNew() ? 'Create preset' : 'Save preset';

  	if (this.state.saving) {
  		return <span>{ text } &nbsp; <SpinnerIcon /></span>
  	} else {
  		return text
  	}  	
  }

  renderDeleteButton() {
  	let text = 'Delete';

		return (
			<Button bsStyle='danger' onClick={ this.handelDeleteClick } disabled={ this.uiIsDisabled() }>
				{ this.state.deleting ? <span>{ text } &nbsp; <SpinnerIcon /></span> : text }
			</Button>
		)  	
  }

	render() {
		let children;

		if (this.props.children) {
			children = React.cloneElement(this.props.children, {
				disabled: this.uiIsDisabled()
			});
		}
		
		return (
			<Well>				
				<Row>
					<Col md={12}>
						<Input
							label={ titleize(underscore(this.props.presetClass.name)) + ' Name' }
							type="text"
							value={ this.props.caption }
							onChange={ this.handleCaptionChange }
							disabled={ this.uiIsDisabled() }
						/>

						{ children }
						
			      <Input
			        type="textarea"
			        label={ titleize(this.getContentAttributeName()) }
			        value={ this.props.content }
			        onChange={ this.handleContentChange }
			        disabled={ this.uiIsDisabled() }
			        rows={10}
			      />
			    </Col>
				</Row>
				<Row>
					<Col md={12}>
			      <Button bsStyle='success' onClick={ this.handleSaveClick } disabled={ this.uiIsDisabled() }>
							{ this.renderSaveButtonText() }
						</Button>
						&nbsp;
						{ this.isNew() ? '' : this.renderDeleteButton() }
						&nbsp;
						<Button onClick={ this.props.onCancelClick } disabled={ this.uiIsDisabled() }>Cancel</Button>
					</Col>
				</Row>
			</Well>
		)
	}
}