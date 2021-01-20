module.exports = function ({ Sequelize, sequelize }) {
	const { User, Thread, Currencies } = require("./models");
	return {
		model: {
			User,
			Thread,
			Currencies
		},
		use: function (modelName) {
			return this.model[`${modelName}`];
		}
	}
}