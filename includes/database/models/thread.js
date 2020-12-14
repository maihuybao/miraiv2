module.exports = function({ sequelize, Sequelize }) {
	let thread = sequelize.define('thread', {
		num: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		threadID: {
			type: Sequelize.BIGINT,
			unique: true
		},
		settings : {
			type: Sequelize.JSON
		},
		banned: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},
		time2unban: {
			type: Sequelize.STRING,
			defaultValue: null
		},
		reasonban: {
			type: Sequelize.STRING,
			defaultValue: null
		},
		otherInfo: {
			type: Sequelize.JSON,
			defaultValue: '{}'
		}
	});
	return thread;
}