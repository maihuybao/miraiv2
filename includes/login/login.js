const login = require("fca-unofficial");

module.exports = (op) => new Promise(function(resolve, reject) {
	login(op, (err, api) => {
		if (err) return reject(require("./error")({ error: err }))
		else return resolve(api);
	})
})