/*module.exports = function ({ Sequelize, sequelize }) {
	const { Users, Threads, Currencies } = require("./models");
	return {
		model: {
			Users,
			Threads,
			Currencies
		},
		use: function (modelName) {
			return this.model[`${modelName}`];
		}
	}
}
*/
const { Users, Threads, Currencies } = require("./models");

module.exports.model = {
	Users,
	Threads,
	Currencies
}

module.exports.use = (modelName) => this.model[`${modelName}`];