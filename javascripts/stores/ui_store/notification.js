'use strict';

import bindAll from 'lodash/bindAll';

let notification = {

	setNotificationSystem(ref) {
		this.notificationSystem = ref;
	},

	success(message = '') {
		this.notificationSystem.addNotification({
      message,
      level: 'success'
    });
	},

	error(message = '') {
		this.notificationSystem.addNotification({
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

		this.notificationSystem.addNotification({
      title: 'Following errors occured',
      message,
      level: 'error'
    });
	}

}

export default bindAll(notification, [
	'setNotificationSystem',
	'success',
	'errors',
	'error'
])