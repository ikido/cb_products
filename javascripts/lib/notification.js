'use strict';

import { UIStore } from 'stores';		        		

export default {

	success(message = '') {
		UIStore.notificationSystem.addNotification({
      message,
      level: 'success'
    });
	},

	error(message = '') {
		UIStore.notificationSystem.addNotification({
      title: 'An error occured',
      message,
      level: 'error'
    });
	},

	errors(errors = []) {
		if (errors.length === 1) {
			this.error(errors[0]);
			return
		}

		errors = errors.reduce((message, error) => {
			return message + '<li>'+error+'</li>';
		}, '');

    let message = '<ul>'+errors+'</ul>';

		UIStore.notificationSystem.addNotification({
      title: 'Following errors occured',
      message,
      level: 'error'
    });
	}

}