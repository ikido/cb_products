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
import Notification from 'lib/notification';

@observer
export default class SearchPresetEditor extends Component {

	/*
	 * subscribes via observer to changes of:
	 *		UIStore.productSearch.query
	 *		UIStore.productSearch.queryCaption
	 *		UIStore.productSearch.selectedSearchPresetId
	 */

	state = {
		loading: false
	}

	handleQueryChange = (e) => {
		UIStore.productSearch.query = e.target.value;
	}

	handleCaptionChange = (e) => {
		UIStore.productSearch.queryCaption = e.target.value;
	}

	savePreset = () => {
		let caption = UIStore.productSearch.queryCaption;
		let query = UIStore.productSearch.query;
		let action

    if (isEmpty(query) || isEmpty(caption)) {
      Notification.error('Search preset must have caption and query');
      return
    }

    if (!!UIStore.productSearch.selectedSearchPresetId) {
    	let preset = SearchPreset.get(UIStore.productSearch.selectedSearchPresetId);
    	action = preset.update
    } else {
    	action = SearchPreset.createProductPreset;
    }

    this.setState({ loading: true });
    action({ caption, query }).then(response => {
    	this.setState({ loading: false });

    	if (response.ok) {
    		Notification.success('Search preset saved')
    	} else {
    		Notification.errors(response.body.caption)
    	}
    });
  }

  renderButtonText() {
  	let text = !!UIStore.productSearch.selectedSearchPresetId ? 'Save preset' : 'Create preset';

  	if (this.state.loading) {
  		return <span>{ text } &nbsp; <SpinnerIcon /></span>
  	} else {
  		return text
  	}  	
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
							disabled={ this.state.loading }
						/>
			      <Input
			        type="textarea"
			        label="Search query"
			        value={ UIStore.productSearch.query }
			        onChange={ this.handleQueryChange }
			        disabled={ this.state.loading }
			        rows={10}
			      />
			    </Col>
				</Row>
				<Row>
					<Col md={12}>
			      <Button bsStyle='success' onClick={ this.savePreset } disabled={ this.state.loading }>
							{ this.renderButtonText() }
						</Button>
					</Col>
				</Row>
			</Well>
		)
	}
}