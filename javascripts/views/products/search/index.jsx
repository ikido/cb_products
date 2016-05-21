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
import SearchParams from 'views/products/search/search_params';

import { UIStore } from 'stores';

import './styles.css';

const ui = UIStore.productSearch;

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
    return (
      <PresetEditor
        caption={ ui.queryCaption }
        content={ ui.query }
        onCaptionChange={ ui.setQueryCaption }
        onContentChange={ ui.setQuery }
        presetClass={ SearchPreset }
        selectedPresetId={ ui.selectedSearchPresetId }
        setSelectedPresetId={ ui.setSelectedSearchPreset }
        onCancelClick={ ui.hideSearchPresetEditor }
      />
    )  
  }

  renderColumnsPresetEditor() {   
    return (
      <PresetEditor
        caption={ ui.columnsCaption }
        content={ ui.columns }
        onCaptionChange={ ui.setColumnsCaption }
        onContentChange={ ui.setColumns }
        presetClass={ ColumnsPreset }
        selectedPresetId={ ui.selectedColumnsPresetId }
        setSelectedPresetId={ ui.setSelectedColumnsPreset }
        onCancelClick={ ui.hideColumnsPresetEditor }
      >
        <AttributeTypeSelector />
      </PresetEditor>
    )  
  }

  renderSearch() {
    return (      
      <div>
        <Row>
          <Col md={6}>
            <PresetSelector
              onSelectedPresetChange={ ui.setSelectedColumnsPreset }
              options={ ColumnsPreset.getSelectOptions() }
              onShowEditorClick={ ui.showColumnsPresetEditor }
              onNewPresetClick={ ui.showNewColumnsPresetEditor }
              selectedPresetId={ ui.selectedColumnsPresetId }
            />
            { ui.showColumnsEditor ? this.renderColumnsPresetEditor() : '' }
          </Col>
          <Col md={6}>
            <PresetSelector
              onSelectedPresetChange={ ui.setSelectedSearchPreset }
              options={ SearchPreset.getSelectOptions() }
              onShowEditorClick={ ui.showSearchPresetEditor }
              onNewPresetClick={ ui.showNewSearchPresetEditor }
              selectedPresetId={ ui.selectedSearchPresetId }
            />
            { ui.showSearchEditor ? this.renderSearchPresetEditor() : '' }
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <SearchParams />
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
