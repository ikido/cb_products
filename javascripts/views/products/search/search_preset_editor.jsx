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

@observer
export default class SearchPresetEditor extends Component {

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
      alert("Search preset must have caption and query");
      return
    }

    if (!!UIStore.productSearch.selectedSearchPresetId) {
    	let preset = SearchPreset.get(UIStore.productSearch.selectedSearchPresetId);
    	action = preset.update
    } else {
    	action = SearchPreset.createProductPreset;
    }

    action({ caption, query });
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
						/>
			      <Input
			        type="textarea"
			        label="Search query"
			        value={ UIStore.productSearch.query }
			        onChange={ this.handleQueryChange }
			        rows={10}
			      />
			    </Col>
				</Row>
				<Row>
					<Col md={12}>
			      <Button bsStyle='success' onClick={ this.savePreset }>
							{ !!UIStore.productSearch.selectedSearchPresetId ? 'Save preset' : 'Create preset' }
						</Button>
					</Col>
				</Row>
			</Well>
		)
	}
}