module.exports = function ({ Sequelize, sequelize }) {
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