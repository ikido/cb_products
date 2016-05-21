'use strict';

import jwtDecode from 'jwt-decode';
import { API } from 'mobx-model';

let Auth = {
	
	login(attributes = {}) {
		let { username, password } = attributes;

		return API.request({
			endpoint: '/login',
			data: { username, password },
			onSuccess: (response) => {
				if (response.body.success) {
					this._token = response.body.token;						
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
Object.defineProperty(Auth, 'token', {
	get: function() { return this._token; }
});

// read token from localstorage on load
Object.assign(Auth, {
	_token: localStorage.getItem('auth-token')
});

export default Auth