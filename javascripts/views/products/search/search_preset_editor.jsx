import React, { PropTypes, Component } from 'react';
import { UIStore } from 'stores';
import { observer } from 'mobx-react';
import { SearchPreset } from 'models';

import isEmpty from 'lodash/isEmpty';

import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Well from 'react-bootstrap/lib/Well';

import SpinnerIcon from 'views/shared/spinner_icon';

@observer
export default class SearchPresetEditor extends Component {

	/*
	 * subscribes via observer to changes of:
	 *		UIStore.productSearch.query
	 *		UIStore.productSearch.queryCaption
	 *		UIStore.productSearch.selectedSearchPresetId
	 */

	state = {
		saving: false,
		deleting: false
	}

	handleQueryChange = (e) => {
		UIStore.productSearch.query = e.target.value;
	}

	handleCaptionChange = (e) => {
		UIStore.productSearch.queryCaption = e.target.value;
	}

	handelDeletePreset = () => {
		let preset = this.getPreset();
		this.setState({ deleting: true });

    preset.destroy().then(response => {
    	this.setState({ deleting: false });

    	if (response.ok) {
    		UIStore.notification.success('Search preset deleted')
    		UIStore.productSearch.selectedSearchPresetId = null;
    		UIStore.productSearch.showSearchEditor = false;
    	} else {
    		UIStore.notification.errors(response.body.caption)
    	}
    });
	}

	handleSavePreset = () => {
		let caption = UIStore.productSearch.queryCaption;
		let query = UIStore.productSearch.query;
		let action

    if (isEmpty(query) || isEmpty(caption)) {
      UIStore.notification.error('Search preset must have caption and query');
      return
    }

    if (!!UIStore.productSearch.selectedSearchPresetId) {
    	let preset = this.getPreset();
    	action = preset.update
    } else {
    	action = SearchPreset.createProductPreset;
    }

    this.setState({ saving: true });
    action({ caption, query }).then(response => {
    	this.setState({ saving: false });

    	if (response.ok) {
    		UIStore.notification.success('Search preset saved')
    		UIStore.productSearch.selectedSearchPresetId = response.body.id;
    		UIStore.productSearch.showSearchEditor = false;
    	} else {
    		UIStore.notification.errors(response.body.caption)
    	}
    });
  }

  handleCancel = () => {
  	UIStore.productSearch.showSearchEditor = false
  }

  uiIsDisabled() {
  	return (this.state.saving || this.state.deleting);
  }

  getPreset() {
  	return SearchPreset.get(UIStore.productSearch.selectedSearchPresetId);
  }

  renderSaveButtonText() {
  	let text = !!UIStore.productSearch.selectedSearchPresetId ? 'Save preset' : 'Create preset';

  	if (this.state.saving) {
  		return <span>{ text } &nbsp; <SpinnerIcon /></span>
  	} else {
  		return text
  	}  	
  }

  renderDeleteButton() {
  	let text = 'Delete';

		return (
			<Button bsStyle='danger' onClick={ this.handelDeletePreset } disabled={ this.uiIsDisabled() }>
				{ this.state.deleting ? <span>{ text } &nbsp; <SpinnerIcon /></span> : text }
			</Button>
		)  	
  }

	render() {
		return (
			<Well>
				<Row>
					<Col md={12}>
						<Input
							label="Caption"
							type="text"
							value={ UIStore.productSearch.queryCaption }
							onChange={ this.handleCaptionChange }
							disabled={ this.uiIsDisabled() }
						/>
			      <Input
			        type="textarea"
			        label="Search query"
			        value={ UIStore.productSearch.query }
			        onChange={ this.handleQueryChange }
			        disabled={ this.uiIsDisabled() }
			        rows={10}
			      />
			    </Col>
				</Row>
				<Row>
					<Col md={12}>
			      <Button bsStyle='success' onClick={ this.handleSavePreset } disabled={ this.uiIsDisabled() }>
							{ this.renderSaveButtonText() }
						</Button>
						&nbsp;
						{ !!UIStore.productSearch.selectedSearchPresetId ? this.renderDeleteButton() : '' }
						&nbsp;
						<Button onClick={ this.handleCancel } disabled={ this.uiIsDisabled() }>Cancel</Button>
					</Col>
				</Row>
			</Well>
		)
	}
}