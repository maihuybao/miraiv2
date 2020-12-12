module.exports = function ({ Sequelize, sequelize }) {
	const force = process.env.NODE_ENV == 'development';
	const user = require("./models/user")({ sequelize, Sequelize });
	const thread = require("./models/thread")({ sequelize, Sequelize });
	user.sync({ force });
	thread.sync({ force });
	return {
		model: {
			user,
			thread
		},
		use: function (modelName) {
			return this.model[`${modelName}`];
		}
	}
}