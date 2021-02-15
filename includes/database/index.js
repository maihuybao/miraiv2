const Sequelize = require("sequelize");
const path = require("path");
let pathConfig = "";
//check argv
const argv = process.argv.slice(2);
if (argv.length !== 0) pathConfig = argv[0];
else pathConfig = "config.json";
let config = require(`../../${pathConfig}`);
let dialect = "sqlite";
module.exports = {
	sequelize: new Sequelize({
		dialect,
		storage: path.resolve(__dirname, `../${config.DATABASE[dialect].storage}`),
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
	Sequelize,
	Op: Sequelize.Op
}
