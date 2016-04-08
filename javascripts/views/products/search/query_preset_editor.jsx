import React, { PropTypes, Component } from 'react';
import { UIStore } from 'stores';
import Input from 'react-bootstrap/lib/Input';
import { observer } from 'mobx-react';

@observer
export default class QueryPresetEditor extends Component {

	handleQueryChange(e) {
		UIStore.productSearch.query = e.target.value;
	}

	render() {
		return (
      <Input
        type="textarea"
        label="Search query"
        value={ UIStore.productSearch.query }
        onChange={ this.handleQueryChange }
        rows={10}
      />
		)
	}
}