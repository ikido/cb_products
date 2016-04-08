'use strict';

import { API } from 'mobx-model';
import Auth from 'lib/Auth';

API.config({
	urlRoot: 'https://products.test.cb.bis.nl/api',
	requestHeaders() {
		return { Authorization: `Bearer ${Auth.token}` };
	},
  onRequestCompleted(response) {
    // console.log('api', response);
  }
});