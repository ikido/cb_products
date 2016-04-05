import React, { Component } from 'react';

export default class ProductSearch extends Component {
	render() {
		return (
      <div id="main" role="main">
        <div id="ribbon">
          <ol className="breadcrumb">
            <li>Home</li>
            <li>Blank</li>
          </ol>
        </div>

        <div className="col-xs-12 col-sm-7 col-md-7 col-lg-4">
          <h1 className="page-title txt-color-blueDark">
            <i className="fa-fw fa fa-home" /> 
            Product search 
          </h1>
          <p>Hello world!</p>
        </div>
      </div>
    )
	}
}
