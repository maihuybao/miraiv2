const login = require("./login");
module.exports = async function({ appState }, callback) {
	if (typeof callback !== "function") return console.error("Chưa có hàm nào được đặt.");
	let api;
	try {
		api = await login({ appState });
		callback(undefined, api);
	}
	catch (e) {
		callback(e);
	}
}
