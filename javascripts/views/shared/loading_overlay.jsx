'use strict';

import merge from 'lodash/merge';
import React, { PropTypes, Component } from 'react';

const defaultWrapperStyle = {
  position: 'relative'
};

const defaultOverlayStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000000
};

export default class LoadingOverlay extends Component {

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    style: PropTypes.object
  };

  renderOverlay() {
    const overlayStyle = merge({}, defaultOverlayStyle, this.props.style);
    return <div style={ overlayStyle } className='loading-overlay-block'></div>
  }

  render () {
    return (
      <div style={ defaultWrapperStyle }>
        { this.props.children }
        { this.props.visible ? this.renderOverlay() : null }
      </div>
    );
  }

};