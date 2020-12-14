module.exports = function({ sequelize, Sequelize }) {
	let currency = sequelize.define('currency', {
		num: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		threadID: {
			type: Sequelize.BIGINT,
			unique: true
		},
		userID: {
			type: Sequelize.BIGINT,
			unique: true
		},
		money: {
			type: Sequelize.BIGINT,
			defaultValue: 0
		},
		otherInfo: {
			type: Sequelize.JSON
		}
	});
	return currency;
}