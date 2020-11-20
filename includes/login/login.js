const login = require("fca-unofficial");
const option = {
	logLevel: "silent",
	forceLogin: true,
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
};
module.exports = (op) => new Promise(function(resolve, reject) {
	login(op, (err, api) => {
		if (err) return reject(err);
		resolve(api)
	})
})