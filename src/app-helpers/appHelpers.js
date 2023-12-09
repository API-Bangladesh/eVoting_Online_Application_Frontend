const _ = require('lodash');

/**
 * Toast Notification
 *
 * @param toast
 * @param type
 * @param error
 * @returns {ToastId | void | never | *|*}
 */
exports.toastNotify = (toast, type, error) => {
	let message = '';
	if (!_.isUndefined(error.data) && !_.isUndefined(error.data.message)) {
		message = error.data.message;
	} else if (!_.isUndefined(error.response) && !_.isUndefined(error.response.data)) {
		message = error.response.data.message;
	} else if (_.isObject(error)) {
		message = error.message;
	} else {
		message = error;
	}

	if (type === 'success') {
		return toast.success(message, {
			position: toast.POSITION.BOTTOM_RIGHT,
			theme: 'colored',
		});
	} else if (type === 'info') {
		return toast.info(message, {
			position: toast.POSITION.BOTTOM_RIGHT,
			theme: 'colored',
		});
	} else if (type === 'warning') {
		return toast.warn(message, {
			position: toast.POSITION.BOTTOM_RIGHT,
			theme: 'colored',
		});
	} else if (type === 'error') {
		return toast.error(message, {
			position: toast.POSITION.BOTTOM_RIGHT,
			theme: 'colored',
		});
	}
};


