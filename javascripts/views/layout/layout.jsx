'use strict';

import React, { Component } from 'react';
import Header from 'views/layout/header';
import Sidebar from 'views/layout/sidebar';
import Footer from 'views/layout/footer';
import NotificationSystem from 'react-notification-system';
import { UIStore } from 'stores';

export default class Layout extends Component {

  componentDidMount() {
    UIStore.notification.setNotificationSystem(this.refs.notificationSystem);
  }

  render() {
    return (
      <div>
        <NotificationSystem ref="notificationSystem" allowHTML={ true }/>
        <div id='layout'>
          <Header />
          <Sidebar />
          { this.props.children }
          <Footer />        
        </div>
      </div>
    );
  }
}
