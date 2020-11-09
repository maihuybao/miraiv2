const login = require("./login");
const { readFileSync } = require("fs");
const { resolve } = require("path");
const appStateFile = resolve(__dirname, './../../appstate.json');
module.exports = async function({ email, password, otpKey }, callback) {
	if (typeof callback !== "function") return console.error("Chưa có hàm nào được đặt.");
	let api;
	try {
		api = await login({ appState: require(appStateFile) }).catch(() => Promise.resolve(login({ email, password, otpKey })));
		callback(undefined, api);
	}
	catch (e) {
		callback(e);
	}
}
