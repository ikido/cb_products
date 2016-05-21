'use strict';

import { API } from 'mobx-model';
import Auth from 'lib/auth';
import { hashHistory } from 'react-router';

API.config({
	urlRoot: process.env.API_ENDPOINT,
	requestHeaders() {
		return { Authorization: `Bearer ${Auth.token}` };
	},
  onRequestCompleted(response) {
  	if (response.status === 403) {
  		Auth.logout()
  		console.log(hashHistory)
  		hashHistory.replace('/login');
  	}
    // console.log('api', response);
  }
});