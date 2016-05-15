'use strict';

import React, { PropTypes, Component } from 'react';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { AttributeType, ColumnsPreset, SearchPreset } from 'models';
import { observer } from 'mobx-react';

import Page from 'views/layout/page';
import PresetSelector from 'views/products/search/preset_selector';
import PresetEditor from 'views/products/search/preset_editor';
import AttributeTypeSelector from 'views/products/search/attribute_type_selector';
import SearchResults from 'views/products/search/search_results';

import { UIStore } from 'stores';

import './styles.css'

@observer
export default class ProductSearch extends Component {

  state = {
    preloading: false
  };

  // preload attribute types and existing presets
  componentWillMount() {
    this.setState({ preloading: true });
    
    Promise.all([
      AttributeType.loadAll(),
      ColumnsPreset.loadAll(),
      SearchPreset.loadAll()
    ]).then(responses => {
      this.setState({ preloading: false });
    });
  }

  renderSearchPresetEditor() {   
    let searchUI = UIStore.productSearch;

    return (
      <PresetEditor
        caption={ searchUI.queryCaption }
        content={ searchUI.query }
        onCaptionChange={ searchUI.setQueryCaption }
        onContentChange={ searchUI.setQuery }
        presetClass={ SearchPreset }
        selectedPresetId={ searchUI.selectedSearchPresetId }
        setSelectedPresetId={ searchUI.setSelectedSearchPreset }
        onCancelClick={ searchUI.hideSearchPresetEditor }
      />
    )  
  }

  renderColumnsPresetEditor() {   
    let searchUI = UIStore.productSearch; 

    return (
      <PresetEditor
        caption={ searchUI.columnsCaption }
        content={ searchUI.columns }
        onCaptionChange={ searchUI.setColumnsCaption }
        onContentChange={ searchUI.setColumns }
        presetClass={ ColumnsPreset }
        selectedPresetId={ searchUI.selectedColumnsPresetId }
        setSelectedPresetId={ searchUI.setSelectedColumnsPreset }
        onCancelClick={ searchUI.hideColumnsPresetEditor }
      >
        <AttributeTypeSelector />
      </PresetEditor>
    )  
  }

  renderSearch() {
    let searchUI = UIStore.productSearch;

    return (
      <div>
        <Row>
          <Col md={6}>
            <PresetSelector
              onSelectedPresetChange={ searchUI.setSelectedColumnsPreset }
              options={ ColumnsPreset.getSelectOptions() }
              onShowEditorClick={ searchUI.showColumnsPresetEditor }
              onNewPresetClick={ searchUI.showNewColumnsPresetEditor }
              selectedPresetId={ searchUI.selectedColumnsPresetId }
            />
            { searchUI.showColumnsEditor ? this.renderColumnsPresetEditor() : '' }
          </Col>
          <Col md={6}>
            <PresetSelector
              onSelectedPresetChange={ searchUI.setSelectedSearchPreset }
              options={ SearchPreset.getSelectOptions() }
              onShowEditorClick={ searchUI.showSearchPresetEditor }
              onNewPresetClick={ searchUI.showNewSearchPresetEditor }
              selectedPresetId={ searchUI.selectedSearchPresetId }
            />
            { searchUI.showSearchEditor ? this.renderSearchPresetEditor() : '' }
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
