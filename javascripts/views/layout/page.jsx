'use strict';

import React, { Component, PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';

export default class PageLayout extends Component {

  static propTypes = {
    // breadcrumbs separated by '/'
    breadcrumbs: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }

  render() {
    return(    
      <div id="main" role="main">
        <div id="ribbon">
          <ol className="breadcrumb">
            { this.props.breadcrumbs.split('/').map((b, i) =>
              <li key={i}>{ b.trim() }</li>
            )}
          </ol>
        </div>

        <Col xs={12} sm={12} md={12} lg={12}  style={{ paddingBottom: '180px'}}>
          <h1 className="page-title txt-color-blueDark">
            <i className="fa-fw fa fa-home" /> 
            { this.props.title }
          </h1>

          { this.props.children }
          
        </Col>
      </div>
    )
  }
}