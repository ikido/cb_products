'use strict';

import { extendObservable } from 'mobx';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import request from 'superagent';

const urlRoot = 'https://products.test.cb.bis.nl/api';

const auth = {
	
	login(attributes = {}) {

		let { username, password } = attributes;

		return new Promise((resolve, reject) => {
			request
				.get(`${urlRoot}/login`)
				.query({ username, password })
				.end((err, response) => {
					if (response.ok && response.body.success) {
						this.token = response.body.token;

						/*
						 * TODO: this can throw an error it token is invalid, 
						 * need to catch it and display in UI
						 */

						let decodedToken = jwtDecode(this.token); 
						this.tokenExpiresAt = decodedToken.expires;
						this.username = decodedToken.username;

						resolve(response);

					} else {
						// TODO: if request was unsuccessfull we should display error
						reject({ err, response });
					}

				});
		});
	},

	loggedIn() {
		return (!isEmpty(this.token) && moment(this.tokenExpiresAt).isAfter(Date.new));
	}
}

extendObservable(auth, {
	token: null,
	tokenExpiresAt: 0,
	username: ''
});

export default auth