const { Users, Threads, Currencies } = require("./models");

module.exports.model = {
	Users,
	Threads,
	Currencies
};

module.exports.use = (modelName) => this.model[`${modelName}`];