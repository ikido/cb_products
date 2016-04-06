'use strict';

import jwtDecode from 'jwt-decode';
import { API } from 'mobx-model';

const urlRoot = 'https://products.test.cb.bis.nl/api';

let auth = {
	
	login(attributes = {}) {
		let { username, password } = attributes;

		return API.request({
			endpoint: '/login',
			data: { username, password },
			onSuccess: (json) => {
				if (json.success) {
					this._token = json.token;						
					localStorage.setItem('auth-token', this._token);
				}
			}
		})
	},

	loggedIn() {
		try {
			let decodedToken = jwtDecode(this._token); 
			return new Date < new Date(decodedToken.expires)
		} catch (err) {
			return false
		}
	}
}

// create getter for the token
Object.defineProperty(auth, 'token', {
	get: function() { return this._token; }
});

// read token from localstorage on load
Object.assign(auth, {
	_token: localStorage.getItem('auth-token')
});

export default auth