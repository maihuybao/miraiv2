const Sequelize = require("sequelize");
const { join, resolve } = require("path");
var argv = require('minimist')(process.argv.slice(2));
var dirConfig;
if (argv["_"].length != 0) dirConfig = join(process.cwd(), argv["_"][0]);
else dirConfig = join(process.cwd(), "config.json");
var config = require(dirConfig);

let dialect = "sqlite";
module.exports = {
	sequelize: new Sequelize({
		dialect,
		storage: resolve(__dirname, `../${config.DATABASE[dialect].storage}`),
		pool: {
			max: 20,
			min: 0,
			acquire: 60000,
			idle: 20000
		},
		retry: {
			match: [
				/SQLITE_BUSY/,
			],
			name: 'query',
			max: 20
		},
		logging: false,
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
			force: false
		},
	}),
	Sequelize
}
