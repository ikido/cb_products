import { API } from 'mobx-model';
import auth from 'lib/auth';

API.config({
	urlRoot: 'https://products.test.cb.bis.nl/api',
	requestHeaders() {
		let headers = { Authorization: `Bearer ${auth.token}` };
		console.log('setting headers for a request', headers);
		
		return headers;
	},
  onRequestCompleted(response) {
    console.log('api', response.body);
  }
});