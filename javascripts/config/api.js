'use strict';

import { API } from 'mobx-model';
import Auth from 'lib/auth';

API.config({
	urlRoot: process.env.API_ENDPOINT,
	requestHeaders() {
		return { Authorization: `Bearer ${Auth.token}` };
	},
  onRequestCompleted(response) {
    // console.log('api', response);
  }
});