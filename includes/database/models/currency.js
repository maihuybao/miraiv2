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
		otherInfo: {
			type: Sequelize.JSON
		},
		banned: {
			type: Sequelize.JSON,
			default: {
				type: 0,
				reason: null,
				time2unban: 0
			}
		},
		
	}