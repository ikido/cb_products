'use strict';

import React, { PropTypes, Component } from 'react';
import toString from 'lodash/toString';
import result from 'lodash/result';
import isArray from 'lodash/isArray';
import includes from 'lodash/includes';
import { AttributeType } from 'models';
import Dropzone from 'react-dropzone';
import { observer } from 'mobx-react';
import SpinnerIcon from 'views/shared/spinner_icon';
import { UIStore } from 'stores';

@observer
export default class ProductColumn extends Component {
  
  static propTypes = {
    column: PropTypes.shape({
    	path: PropTypes.string.isRequired,
    	header: PropTypes.string
    }).isRequired,
    product: PropTypes.object.isRequired
  }

  state = { loading: false }

  handleDrop = (files) => {
    if (this.isFileColumn()) {
      let attributeTypeName = this.props.column.path.split('.').slice(-1)[0];  

      this.setState({ loading: true });
      this.props.product.uploadFile({ file: files[0], attributeTypeName }).then(response => {
        this.setState({ loading: false })
        if (response.ok) {
          UIStore.notification.success('File uploaded')
        } else {
          UIStore.notification.error(response.body.details)
        }
      })
    }      
  }

  isFileColumn() {
    let [attibutes, attrName] = this.props.column.path.split('.').slice(-2);
    return (attibutes === 'attributes' && includes(AttributeType.fileAttributes, attrName))
  }

  renderDropZone() {
    return (
      <Dropzone onDrop={ this.handleDrop } multiple={ false }>
        <div>Drop a file here or click to upload</div>
      </Dropzone>
    )
  }

  renderLoading() {
    return <span>Uploading file &nbsp; <SpinnerIcon /></span>
  }

  render() {
    
    let columnValue = result(this.props.product.toJSON(), this.props.column.path);

    if (!!columnValue && this.isFileColumn()) {
      // TODO: remove this check when server will always return array for this field type
      columnValue = !!columnValue.slice ? columnValue.length : 1;
      return (
        <td>
          { columnValue }
          <br />
          { this.state.loading ? this.renderLoading() : this.renderDropZone() }
        </td>
      );
    } else {
      return <td>{ toString(columnValue) }</td>
    }    
  }
}