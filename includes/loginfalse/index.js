const login = require("./login.js");

module.exports = async ({ appState }, callback) => {
	try {
		let api = await login({ appState }).catch(() => {
			let email, pasword, otpKey;
			try {
				const config = require("../../config.json");
				email = config.EMAIL;
				password = config.PASSWORD;
				otpKey = config.OTPKEY.replace(/\s+/g, '').toLowerCase();
			} catch (error) {
				email = process.env.EMAIL;
				password = process.env.PASSWORD;
				otpKey = process.env.OTPKEY.replace(/\s+/g, '').toLowerCase();
			}
			Promise.resolve(login({ email, password, otpKey }))
		});
		(api) ? callback(undefined, api) : callback(1, undefined);
	} catch (error) {
		callback(error.message);
	}
}