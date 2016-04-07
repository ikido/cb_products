import { API } from 'mobx-model';
import auth from 'lib/auth';

API.config({
	urlRoot: 'https://products.test.cb.bis.nl/api',
	requestHeaders() {
		return { Authorization: `Bearer ${auth.token}` }
	},
  onRequestCompleted(response) {
    console.log('api', response.body);
  }
});