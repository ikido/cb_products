'use strict';

import React, { Component } from 'react';

export default class Sidebar extends Component {
  render() {
    return (
      <aside id="left-panel">
        {/* User info */}
        <div className="login-info">
          <span> {/* User image size is adjusted inside CSS, it should stay as is */} 
            <a href="javascript:void(0);" id="show-shortcut" data-action="toggleShortcut">
              <img src="img/avatars/sunny.png" alt="me" className="online" /> 
              <span>
                john.doe 
              </span>
              &nbsp;
              <i className="fa fa-angle-down" />
            </a> 
          </span>
        </div>
        {/* end user info */}
        {/* NAVIGATION : This navigation is also responsive

      To make this navigation dynamic please make sure to link the node
      (the reference to the nav > ul) after page load. Or the navigation
      will not initialize.
      */}
        <nav>
          {/* 
        NOTE: Notice the gaps after each icon usage <i></i>..
        Please note that these links work a bit different than
        traditional href="" links. See documentation for details.
        */}
          <ul>
            <li className>
              <a href="javascript:void(0);" title="blank_"><i className="fa fa-lg fa-fw fa-home" /> <span className="menu-item-parent">Blank</span></a>
            </li>
          </ul>
        </nav>
        <span className="minifyme" data-action="minifyMenu"> <i className="fa fa-arrow-circle-left hit" /> </span>
      </aside>
    );
  }
}
