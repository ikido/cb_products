'use strict';

import moment from 'moment';
import jwtDecode from 'jwt-decode';
import request from 'superagent';

const urlRoot = 'https://products.test.cb.bis.nl/api';

let auth = {
	
	login(attributes = {}) {
		let { username, password } = attributes;

		return new Promise((resolve, reject) => {
			request
				.get(`${urlRoot}/login`)
				.query({ username, password })
				.end((err, response) => {
					if (response.ok && response.body.success) {
						this._token = response.body.token;						
						localStorage.setItem('auth-token', this._token);
						resolve(response);
					} else {
						// TODO: if request was unsuccessfull we should display error
						reject({ err, response });
					}

				});
		});
	},

	loggedIn() {
		try {
			let decodedToken = jwtDecode(this._token); 
			return moment(decodedToken.expires).isAfter(Date.new);
		} catch (err) {
			return false
		}
	}
}

// create getter for the token
Object.defineProperty(auth, 'token', {
	get: () => { return this._token; }
});

// read token from localstorage on load
Object.assign(auth, {
	_token: localStorage.getItem('auth-token')
});

export default auth