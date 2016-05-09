'use strict';

import React, { PropTypes, Component } from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { AttributeType, ColumnPreset, SearchPreset } from 'models';
import { observer } from 'mobx-react';

import Page from 'views/layout/page';
import ColumnPresetEditor from 'views/products/search/column_preset_editor';
import PresetSelector from 'views/products/search/preset_selector';
import SearchPresetEditor from 'views/products/search/search_preset_editor';
import SearchResults from 'views/products/search/search_results';

import { UIStore } from 'stores';

import './styles.css'

@observer
export default class ProductSearch extends Component {

  state = {
    preloading: false
  };

  componentWillMount() {
    this.setState({ preloading: true });
    
    Promise.all([
      AttributeType.loadAll(),
      ColumnPreset.loadAll(),
      SearchPreset.loadAll()
    ]).then(responses => {
      this.setState({ preloading: false });
    });
  }

  renderSearch() {
    let searchUI = UIStore.productSearch;

    return (
      <div>
        <Row>
          <Col md={6}>
            <PresetSelector
              onSelectedPresetChange={ searchUI.setSelectedColumnPreset }
              options={ ColumnPreset.getSelectOptions() }
              onShowEditorClick={ searchUI.showColumnPresetEditor }
              onNewPresetClick={ searchUI.showNewColumnPresetEditor }
              selectedPresetId={ searchUI.selectedColumnPresetId }
            />
            { searchUI.columnPresetEditorShown ? <ColumnPresetEditor /> : '' }
          </Col>
          <Col md={6}>
            <PresetSelector
              onSelectedPresetChange={ searchUI.setSelectedSearchPreset }
              options={ SearchPreset.getSelectOptions() }
              onShowEditorClick={ searchUI.showSearchPresetEditor }
              onNewPresetClick={ searchUI.showNewSearchPresetEditor }
              selectedPresetId={ searchUI.selectedSearchPresetId }
            />
            { searchUI.searchPresetEditorShown ? <SearchPresetEditor /> : '' }
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <SearchResults />
          </Col>
        </Row>
      </div>
    )
  }

  render() {
    return (
      <Page
        breadcrumbs={ 'Home / Blank' }
        title='Product search'
      >
        { this.state.preloading ? <h1>Preloading...</h1> : this.renderSearch() }
      </Page>
    )
  }
}
