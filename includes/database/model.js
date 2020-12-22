module.exports = function ({ Sequelize, sequelize }) {
	const force = true;
	const user = require("./models/user")({ sequelize, Sequelize });
	const thread = require("./models/thread")({ sequelize, Sequelize });
	const currency = require("./models/currency")({ sequelize, Sequelize });
	user.sync({ force });
	thread.sync({ force });
	currency.sync({ force });
	return {
		model: {
			user,
			thread,
			currency
		},
		use: function (modelName) {
			return this.model[`${modelName}`];
		}
	}
}