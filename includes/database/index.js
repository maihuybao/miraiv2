const Sequelize = require("sequelize");
const path = require("path");
module.exports = {
	sequelize: new Sequelize({
		dialect: "sqlite",
		storage: path.resolve(__dirname, "../data.sqlite"),
		pool: {
			max: 10,
			min: 0,
			acquire: 30000,
			idle: 10000
		},
		retry: {
			match: [
				/SQLITE_BUSY/,
			],
			name: 'query',
			max: 10
		},
		logging: process.env.NODE_ENV == 'development' ? console.log : false,
		transactionType: 'IMMEDIATE',
		define: {
			underscored: false,
			freezeTableName: true,
			charset: 'utf8',
			dialectOptions: {
				collate: 'utf8_general_ci'
			},
			timestamps: true
		},
		sync: {
			force: process.env.NODE_ENV == 'build'
		},
	}),
	Sequelize,
	Op: Sequelize.Op
}
